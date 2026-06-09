import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button"

export default function Component() {
  
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <section className="w-full flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Randomizer
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Truly discover hidden gems
                </p>
              </div>
              {/* Get Started Button */}
              <div className="space-x-4">
              <Button onClick={() => router.push('/api/spotify-login')}>
                Connect with Spotify
                <Image
                    src="/Spotify_logo_without_text.svg"
                    alt="Spotify Logo"
                    width={24}
                    height={24}
                    style={{ marginRight: 0 }}
                  />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
