// "use client";

// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";
// import { Loader2 } from "lucide-react";

// interface InviteFormProps {
//   projectId: string;
// }

// export default function InviteForm({ projectId }: InviteFormProps) {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { toast } = useToast();

//   async function sendInvite() {
//     if (!email) {
//       toast({
//         title: "Email required",
//         description: "Please enter a valid email.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch("/api/invite", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email,
//           projectId,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Failed to send invite");
//       }

//       toast({
//         title: "Invite sent!",
//         description: `An invite email was sent to ${email}`,
//       });

//       setEmail("");
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     }

//     setLoading(false);
//   }

//   return (
//     <div className="flex items-center gap-2 w-full max-w-md">
//       <Input
//         type="email"
//         placeholder="Enter email to invite..."
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         className="flex-1"
//       />

//       <Button onClick={sendInvite} disabled={loading}>
//         {loading ? (
//           <>
//             <Loader2 className="animate-spin h-4 w-4 mr-2" />
//             Sending...
//           </>
//         ) : (
//           "Send Invite"
//         )}
//       </Button>
//     </div>
//   );
// }
