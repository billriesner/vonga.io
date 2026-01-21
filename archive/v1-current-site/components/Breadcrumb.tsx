import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  light?: boolean; // For use on dark/image backgrounds
}

export function Breadcrumb({ items, className = '', light = false }: BreadcrumbProps) {
  const textColor = light ? '#FFFFFF' : '#303E55';
  const currentColor = light ? '#33BECC' : '#33BECC';
  const textShadow = light ? '0 1px 2px rgba(0,0,0,0.5)' : '0 1px 2px rgba(255,255,255,0.8)';

  return (
    <nav className={`flex items-center gap-2 text-sm ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <span key={index} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link 
                href={item.href} 
                className="hover:underline font-semibold"
                style={{ color: textColor, textShadow }}
              >
                {item.label}
              </Link>
            ) : (
              <span 
                className="font-bold"
                style={{ color: isLast ? currentColor : textColor, textShadow }}
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <span className="font-bold" style={{ color: textColor, textShadow }}>/</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

