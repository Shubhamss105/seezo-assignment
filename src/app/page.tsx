import { Button } from "@/components/ui/button";
import { UserButton} from "@clerk/nextjs";
import { auth } from '@clerk/nextjs/server'
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";


export default async function Home() {

  const { userId }: { userId: string | null } = auth()
  // const { userId } = await auth();
  const isAuth = !!userId;

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Security design reviews for every feature your company builds</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="flex mt-2">
            {isAuth && (
              <>
                <Link href={`/assesments`}>
                  <Button>
                    Go to Assesments <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <div className="ml-3">
                  {/* <SubscriptionButton isPro={isPro} /> */}
                </div>
              </>
            )}
          </div>
          <p className="max-w-xl mt-1 text-lg text-slate-600">
          Seezo provides context-specific security requirements to developers before they start coding
          </p>

          <div className="w-full mt-4">
            {isAuth ? (
              ""
            ) : (
              <Link href="/sign-in">
                <Button>
                  Login to get Started!
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
