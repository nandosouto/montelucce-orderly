
import type { Config } from "tailwindcss";

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
                montelucce: {
                    yellow: '#F5B800',
                    black: '#121212',
                    gray: '#8E9196',
                    'light-gray': '#F6F6F7',
                    'silver-gray': '#9F9EA1'
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
                    from: {
                        opacity: '0',
                    },
                    to: {
                        opacity: '1',
                    },
                },
                'slide-in-right': {
                    from: {
                        transform: 'translateX(100%)',
                        opacity: '0',
                    },
                    to: {
                        transform: 'translateX(0)',
                        opacity: '1',
                    },
                },
                'slide-in-left': {
                    from: {
                        transform: 'translateX(-100%)',
                        opacity: '0',
                    },
                    to: {
                        transform: 'translateX(0)',
                        opacity: '1',
                    },
                },
                'slide-in-up': {
                    from: {
                        transform: 'translateY(100%)',
                        opacity: '0',
                    },
                    to: {
                        transform: 'translateY(0)',
                        opacity: '1',
                    },
                },
                'scale-in': {
                    from: {
                        transform: 'scale(0.95)',
                        opacity: '0',
                    },
                    to: {
                        transform: 'scale(1)',
                        opacity: '1',
                    },
                },
                'pulse-slow': {
                    '0%, 100%': {
                        opacity: '1',
                    },
                    '50%': {
                        opacity: '0.8',
                    },
                },
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.5s ease-out forwards',
                'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
                'slide-in-left': 'slide-in-left 0.5s ease-out forwards',
                'slide-in-up': 'slide-in-up 0.5s ease-out forwards',
                'scale-in': 'scale-in 0.3s ease-out forwards',
                'pulse-slow': 'pulse-slow 3s infinite',
			},
            boxShadow: {
                'neo': '5px 5px 10px rgba(0, 0, 0, 0.1), -5px -5px 10px rgba(255, 255, 255, 0.05)',
                'neo-inset': 'inset 5px 5px 10px rgba(0, 0, 0, 0.1), inset -5px -5px 10px rgba(255, 255, 255, 0.05)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
            },
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
