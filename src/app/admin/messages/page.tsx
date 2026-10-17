import { redirect } from "next/navigation";
import { MessagesPanel } from "@/components/admin/messages-panel";
import { getMessages } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/admin/messages");

  const messages = await getMessages();

  return <MessagesPanel messages={messages} />;
}
