/**
 * BotAvatar — renders the Topstocx 3D bot PNG with a brand-colored glow.
 *   - variant='manu'  -> brand blue glow  (#005AFF / #77A6FF)
 *   - variant='atlas' -> brand green glow (#39B54A / #59E16C)
 */
export default function BotAvatar({ size = 80, variant = 'manu', glow = true, style = {} }) {
    const isManu = variant === 'manu';
    const primary = isManu ? '0, 90, 255' : '57, 181, 74';
    const lighter = isManu ? '119, 166, 255' : '89, 225, 108';

    const dropShadow = glow
        ? `drop-shadow(0 8px 18px rgba(0,0,0,0.45)) drop-shadow(0 0 18px rgba(${primary}, 0.55)) drop-shadow(0 0 6px rgba(${lighter}, 0.35))`
        : `drop-shadow(0 0 8px rgba(${primary}, 0.4))`;

    return (
        <img
            src="/topstocx.png"
            alt="Topstocx Bot"
            width={size}
            height={size}
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: dropShadow,
                // Atlas variant gets a subtle green hue-rotate to differentiate from Manu
                ...(isManu ? {} : { filter: `${dropShadow} hue-rotate(90deg) saturate(1.1)` }),
                ...style,
            }}
        />
    );
}
