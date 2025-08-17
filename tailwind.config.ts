
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'sans': ['Inter', 'system-ui', 'sans-serif'],
				'display': ['Playfair Display', 'serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Chandra-Dhara Lunar Calendar Colors
				paksha: {
					shukla: {
						50: '#fdf2f8',
						100: '#fce7f3',
						200: '#fbcfe8',
						500: '#ec4899',
						600: '#db2777',
						900: '#831843'
					},
					krishna: {
						50: '#eef2ff',
						100: '#e0e7ff',
						200: '#c7d2fe',
						500: '#6366f1',
						600: '#4f46e5',
						900: '#312e81'
					}
				},
				ritu: {
					vasant: '#dcfce7',   // spring green
					grishma: '#fef3c7',  // summer yellow
					varsha: '#dbeafe',   // monsoon blue
					sharad: '#fed7aa',   // autumn orange
					hemant: '#f3f4f6',   // winter gray
					shishir: '#cffafe'   // late winter cyan
				},
				lunar: {
					gold: '#fbbf24',
					silver: '#e5e7eb',
					copper: '#d97706'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'chandra-pulse': {
					'0%, 100%': {
						boxShadow: '0 0 0 0 rgba(236, 72, 153, 0.4)',
						transform: 'scale(1)'
					},
					'50%': {
						boxShadow: '0 0 0 10px rgba(236, 72, 153, 0)',
						transform: 'scale(1.05)'
					}
				},
				'moon-glow': {
					'0%, 100%': {
						filter: 'drop-shadow(0 0 5px rgba(251, 191, 36, 0.3))'
					},
					'50%': {
						filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.8))'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'chandra-pulse': 'chandra-pulse 2s ease-in-out infinite',
				'moon-glow': 'moon-glow 3s ease-in-out infinite'
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
