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

    // Get API key
    const apiKey = Deno.env.get('VEDIC_ASTRO_API_KEY');
    if (!apiKey) {
      throw new Error('VEDIC_ASTRO_API_KEY not configured');
    }

    // Parse date
    const [year, month, day] = date.split('-');
    
    // Call VedicAstroAPI for basic panchang
    const apiUrl = 'https://json.astrologyapi.com/v1/basic_panchang';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${apiKey.split(':')[0]}:${apiKey.split(':')[1]}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        day: parseInt(day),
        month: parseInt(month),
        year: parseInt(year),
        hour: 6,
        min: 0,
        lat: lat,
        lon: lon,
        tzone: tzone
      }),
    });

    if (!response.ok) {
      throw new Error(`VedicAstroAPI error: ${response.status}`);
    }

    const apiData: VedicAstroResponse = await response.json();
    console.log('VedicAstroAPI response:', JSON.stringify(apiData, null, 2));

    if (!apiData.status) {
      throw new Error('Invalid response from VedicAstroAPI');
    }

    // Transform API response to match PanchangaDay interface
    const panchangaData = {
      dateISO: date,
      timezone: 'Asia/Kolkata',
      ritu: apiData.response.ritu?.ritu_name || 'Varṣā',
      masa: apiData.response.hindu_maah?.amanta_name || 'Bhādrapada',
      paksha: apiData.response.paksha === 'Shukla' ? 'Śukla' : 'Kṛṣṇa',
      tithi: {
        name: apiData.response.tithi?.details?.tithi_name || 'Pratipat',
        index: apiData.response.tithi?.details?.tithi_number || 1,
        start: `${date}T06:00:00+05:30`,
        end: `${date}T${String(apiData.response.tithi?.end_time?.hour || 18).padStart(2, '0')}:${String(apiData.response.tithi?.end_time?.minute || 0).padStart(2, '0')}:00+05:30`,
      },
      nakshatra: {
        name: apiData.response.nakshatra?.details?.nak_name || 'Aśvinī',
        end: `${date}T${String(apiData.response.nakshatra?.end_time?.hour || 18).padStart(2, '0')}:${String(apiData.response.nakshatra?.end_time?.minute || 0).padStart(2, '0')}:00+05:30`,
      },
      yoga: apiData.response.yog?.details?.yog_name || 'Viṣkambha',
      karana: apiData.response.karan?.details?.karan_name || 'Bava',
      sunrise: `${date}T${apiData.response.sunrise || '06:00:00'}+05:30`,
      sunset: `${date}T${apiData.response.sunset || '18:00:00'}+05:30`,
      moonrise: `${date}T${apiData.response.moonrise || '20:00:00'}+05:30`,
      moonset: `${date}T${apiData.response.moonset || '08:00:00'}+05:30`,
      festivals: [], // TODO: Add festival data from API if available
      astroTip: "Align your actions with today's cosmic rhythm for harmonious living.",
      moonPhase: {
        name: apiData.response.moon_phase || 'Waxing Crescent',
        illumination: 50, // TODO: Calculate from moon phase
        emoji: '🌒'
      },
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
    
    // Return fallback mock data on error
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
      festivals: [],
      astroTip: "Unable to fetch live data. Please try again later.",
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