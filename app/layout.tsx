
import { Providers } from './utils/providers';

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>   {children} </Providers>
      </body>
    </html>
  );
}

export default RootLayout;
