
import { HomeView } from "@/modules/home/ui/view/home-view";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";



const Homepage = async () => {

  const session = await auth.api.getSession({
    headers: await headers()

  });

  if( !session ) {
    redirect("/sign-in");
  }

  return (
    <div>
      <HomeView />
    </div>
  )
}

export default Homepage