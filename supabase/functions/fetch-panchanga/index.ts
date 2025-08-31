import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VedicAstroResponse {
  status: boolean;
  response: {
    tithi: {
      details: { tithi_name: string; tithi_number: number; };
      end_time: { hour: number; minute: number; second: number; };
    };
    nakshatra: {
      details: { nak_name: string; };
      end_time: { hour: number; minute: number; second: number; };
    };
    yog: { details: { yog_name: string; }; };
    karan: { details: { karan_name: string; }; };
    hindu_maah: { amanta_name: string; purnimanta_name: string; };
    ritu: { ritu_name: string; };
    paksha: string;
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moon_phase: string;
    auspicious_timing?: any;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { date, lat = 28.6139, lon = 77.2090, tzone = 5.5 } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check cache first
    const { data: cachedData } = await supabase
      .from('panchanga_cache')
      .select('panchanga_data')
      .eq('cache_date', date)
      .single();
    
    if (cachedData) {
      console.log('Returning cached panchanga data for', date);
      return new Response(JSON.stringify(cachedData.panchanga_data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse API credentials (format: user_id:api_key)
    const vedicAstroCredentials = Deno.env.get('VEDIC_ASTRO_API_KEY');
    if (!vedicAstroCredentials || !vedicAstroCredentials.includes(':')) {
      throw new Error('VEDIC_ASTRO_API_KEY must be in format user_id:api_key');
    }
    
    const [user_id, api_key] = vedicAstroCredentials.split(':', 2);
    if (!user_id || !api_key) {
      throw new Error('Invalid API credentials format');
    }

    console.log('Using VedicAstroAPI with user_id:', user_id);
    
    // Call VedicAstroAPI v3 panchang endpoint
    const apiUrl = 'https://api.vedicastroapi.com/v3-json/panchang/panchang';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user_id,
        api_key: api_key,
        date: date,
        lat: lat,
        lon: lon,
        tzone: tzone
      }),
    });

    if (!response.ok) {
      throw new Error(`VedicAstroAPI error: ${response.status}`);
    }

    const apiData = await response.json();
    console.log('VedicAstroAPI response status:', response.status);
    console.log('VedicAstroAPI response:', JSON.stringify(apiData, null, 2));

    if (!response.ok || !apiData.status) {
      const errorMsg = apiData.msg || `HTTP ${response.status}`;
      console.error('API Error:', errorMsg);
      throw new Error(`VedicAstroAPI Error: ${errorMsg}`);
    }

    // Enhanced data transformation with proper API response mapping
    const response_data = apiData.response || apiData;
    
    // Calculate moon phase from tithi for better accuracy
    const getMoonPhaseFromTithi = (tithiName: string) => {
      const tithiIndex = parseInt(tithiName?.split(' ')[0]) || 1;
      if (tithiIndex <= 7) return { name: 'Waxing Crescent', illumination: Math.round((tithiIndex / 15) * 50), emoji: '🌒' };
      if (tithiIndex <= 15) return { name: 'Waxing Gibbous', illumination: Math.round(50 + ((tithiIndex - 7) / 8) * 50), emoji: '🌔' };
      if (tithiIndex <= 22) return { name: 'Waning Gibbous', illumination: Math.round(100 - ((tithiIndex - 15) / 7) * 50), emoji: '🌖' };
      return { name: 'Waning Crescent', illumination: Math.round(50 - ((tithiIndex - 22) / 8) * 50), emoji: '🌘' };
    };

    // Get current season based on masa
    const getCurrentRitu = (masa: string) => {
      const rituMap: Record<string, string> = {
        'Chaitra': 'Vasanta', 'Vaishakha': 'Vasanta',
        'Jyeshtha': 'Grishma', 'Ashadha': 'Grishma',
        'Shravana': 'Varsha', 'Bhadrapada': 'Varsha',
        'Ashvin': 'Sharad', 'Kartik': 'Sharad',
        'Agrahayan': 'Hemanta', 'Pausha': 'Hemanta',
        'Magha': 'Shishira', 'Phalguna': 'Shishira'
      };
      return rituMap[masa] || 'Varsha';
    };

    // Transform API response to match PanchangaDay interface
    const panchangaData = {
      dateISO: date,
      timezone: 'Asia/Kolkata',
      ritu: getCurrentRitu(response_data.masa || response_data.hindu_maah?.amanta_name || 'Bhadrapada'),
      masa: response_data.masa || response_data.hindu_maah?.amanta_name || 'Bhadrapada',
      paksha: (response_data.paksha === 'Shukla' || response_data.paksha === 'Śukla') ? 'Śukla' : 'Kṛṣṇa',
      tithi: {
        name: response_data.tithi?.details?.tithi_name || response_data.tithi || 'Pratipat',
        index: response_data.tithi?.details?.tithi_number || parseInt(response_data.tithi?.split(' ')[0]) || 1,
        start: `${date}T06:00:00+05:30`,
        end: response_data.tithi?.end_time ? 
          `${date}T${String(response_data.tithi.end_time.hour || 18).padStart(2, '0')}:${String(response_data.tithi.end_time.minute || 0).padStart(2, '0')}:00+05:30` :
          `${date}T18:00:00+05:30`,
      },
      nakshatra: {
        name: response_data.nakshatra?.details?.nak_name || response_data.nakshatra || 'Ashvini',
        end: response_data.nakshatra?.end_time ? 
          `${date}T${String(response_data.nakshatra.end_time.hour || 18).padStart(2, '0')}:${String(response_data.nakshatra.end_time.minute || 0).padStart(2, '0')}:00+05:30` :
          `${date}T18:00:00+05:30`,
      },
      yoga: response_data.yog?.details?.yog_name || response_data.yoga || 'Vishkambha',
      karana: response_data.karan?.details?.karan_name || response_data.karana || 'Bava',
      sunrise: `${date}T${response_data.sunrise || '06:00:00'}+05:30`,
      sunset: `${date}T${response_data.sunset || '18:00:00'}+05:30`,
      moonrise: `${date}T${response_data.moonrise || '20:00:00'}+05:30`,
      moonset: `${date}T${response_data.moonset || '08:00:00'}+05:30`,
      festivals: response_data.festivals?.map((f: any) => ({
        name: f.name || f,
        type: f.type || 'Religious',
        importance: f.importance || 'Medium',
        isToday: true
      })) || [],
      astroTip: response_data.astro_tip || "Align your actions with today's cosmic rhythm for harmonious living.",
      moonPhase: getMoonPhaseFromTithi(response_data.tithi?.details?.tithi_name || response_data.tithi || 'Pratipat'),
      doshaGunaBlocks: [
        {
          from: '04:00',
          to: '06:00',
          guna: 'Sattva' as const,
          dosha: 'Vāta' as const,
          do: ['Wake up', 'Set Sankalpa', 'Meditation', 'Journaling'],
          avoid: ['Social media', 'Heavy meals']
        },
        {
          from: '06:00',
          to: '10:00',
          guna: 'Rajas' as const,
          dosha: 'Pitta' as const,
          do: ['Deep work', 'Planning', 'Sun exposure', 'Physical exercise'],
          avoid: ['Heavy meals before 9am', 'Emotional decisions']
        },
        {
          from: '10:00',
          to: '14:00',
          guna: 'Rajas' as const,
          dosha: 'Pitta' as const,
          do: ['Productive work', 'Meetings', 'Learning'],
          avoid: ['Overeating', 'Excessive heat']
        },
        {
          from: '14:00',
          to: '18:00',
          guna: 'Tamas' as const,
          dosha: 'Kapha' as const,
          do: ['Light activities', 'Creative work', 'Rest'],
          avoid: ['Important decisions', 'Heavy physical work']
        },
        {
          from: '18:00',
          to: '22:00',
          guna: 'Sattva' as const,
          dosha: 'Kapha' as const,
          do: ['Reflection', 'Family time', 'Light meals', 'Spiritual practice'],
          avoid: ['Stimulating activities', 'Work stress']
        },
        {
          from: '22:00',
          to: '04:00',
          guna: 'Tamas' as const,
          dosha: 'Kapha' as const,
          do: ['Sleep preparation', 'Gentle stretching'],
          avoid: ['Screens', 'Heavy foods', 'Intense activities']
        }
      ]
    };

    // Cache the result
    await supabase
      .from('panchanga_cache')
      .upsert({
        cache_date: date,
        panchanga_data: panchangaData
      });

    console.log('Cached panchanga data for', date);

    return new Response(JSON.stringify(panchangaData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-panchanga function:', error);
    
    // Enhanced error handling with specific error types
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const isAuthError = errorMessage.includes('Invalid') || errorMessage.includes('user_id') || errorMessage.includes('api_key') || errorMessage.includes('credentials');
    const isApiError = errorMessage.includes('VedicAstroAPI') || errorMessage.includes('HTTP');
    
    console.error('Error classification - Auth:', isAuthError, 'API:', isApiError, 'Message:', errorMessage);
    
    // Return enhanced fallback data with error context
    const fallbackData = {
      dateISO: new Date().toISOString().split('T')[0],
      timezone: 'Asia/Kolkata',
      ritu: 'Varṣā',
      masa: 'Bhādrapada',
      paksha: 'Śukla' as const,
      tithi: {
        name: 'Pratipat',
        index: 1,
        start: `${new Date().toISOString().split('T')[0]}T06:00:00+05:30`,
        end: `${new Date().toISOString().split('T')[0]}T18:00:00+05:30`,
      },
      nakshatra: {
        name: 'Aśvinī',
        end: `${new Date().toISOString().split('T')[0]}T18:00:00+05:30`,
      },
      yoga: 'Viṣkambha',
      karana: 'Bava',
      sunrise: `${new Date().toISOString().split('T')[0]}T06:00:00+05:30`,
      sunset: `${new Date().toISOString().split('T')[0]}T18:00:00+05:30`,
      moonrise: `${new Date().toISOString().split('T')[0]}T20:00:00+05:30`,
      moonset: `${new Date().toISOString().split('T')[0]}T08:00:00+05:30`,
      festivals: [{
        name: isAuthError ? 'API Authentication Issue' : isApiError ? 'API Service Unavailable' : 'System Error',
        type: 'System',
        importance: 'High' as const,
        note: isAuthError ? 'Check API credentials format (user_id:api_key)' : isApiError ? 'VedicAstroAPI service issue' : 'Unknown error occurred',
        isToday: true
      }],
      astroTip: isAuthError ? 
        "API credentials need verification. Using mock data for now." :
        isApiError ? 
        "VedicAstroAPI temporarily unavailable. Using calculated data." :
        "System error occurred. Please try refreshing.",
      moonPhase: {
        name: 'Waxing Crescent',
        illumination: 50,
        emoji: '🌒'
      },
      doshaGunaBlocks: [
        {
          from: '04:00',
          to: '06:00',
          guna: 'Sattva' as const,
          dosha: 'Vāta' as const,
          do: ['Wake up', 'Set Sankalpa', 'Meditation'],
          avoid: ['Social media', 'Heavy meals']
        }
      ]
    };

    return new Response(JSON.stringify(fallbackData), {
      status: 200, // Return 200 with fallback data
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});