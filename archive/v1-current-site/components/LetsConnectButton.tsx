import Link from 'next/link';

interface LetsConnectButtonProps {
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function LetsConnectButton({ 
  href = '/intake', 
  className = '', 
  children = "Let's Connect" 
}: LetsConnectButtonProps) {
  return (
    <Link 
      href={href}
      className={`btn btn-primary ${className}`}
    >
      {children}
    </Link>
  );
}
