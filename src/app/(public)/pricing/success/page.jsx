import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CircleCheckFill } from '@gravity-ui/icons';
// 🌟 Make sure this path points to where your verifyPaymentSession action lives
import { verifyPaymentSession } from '@/app/lib/actions/subscribeAction';

export default async function SuccessPage({ searchParams }) {
    const { session_id, recipe_id } = await searchParams;

    // If there's no session token, bounce them back safely
    if (!session_id) {
        return redirect('/pricing');
    }

    // Call your unified Server Action to ping Express and write changes
    const result = await verifyPaymentSession(session_id);
    const isVerified = result.success;

    return (
        <div className="w-full min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-center items-center p-6 select-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

            <section className="relative max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center overflow-hidden">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                    <CircleCheckFill className="w-8 h-8 text-emerald-500" />
                </div>

                <h1 className="text-2xl font-extrabold text-zinc-50 tracking-tight mb-2">
                    {recipe_id ? "Purchase Successful!" : "Payment Successful!"}
                </h1>
                
                {isVerified ? (
                    <p className="text-emerald-400 text-sm font-medium mb-6">
                        {recipe_id 
                            ? "🎉 Recipe unlocked and synced via Express Database Matrix." 
                            : "🎉 Premium status updated via Express Database Matrix."
                        }
                    </p>
                ) : (
                    <p className="text-rose-400 text-sm font-medium mb-6">
                        Payment verified, but Express database sync failed.
                    </p>
                )}

                <div className="space-y-3">
                    {recipe_id ? (
                        /* 🌟 DYNAMIC BUTTON: Takes them straight to their new recipe if they bought one */
                        <Link 
                            href={`/recipes/${recipe_id}`} 
                            className="block w-full text-center text-xs font-semibold px-4 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl transition duration-200"
                        >
                            Open Unlocked Recipe
                        </Link>
                    ) : (
                        /* Standard Subscription / Dashboard fallback fallback path */
                        <Link 
                            href="/dashboard" 
                            className="block w-full text-center text-xs font-semibold px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition duration-200"
                        >
                            Go to Workspace Dashboard
                        </Link>
                    )}
                </div>
            </section>
        </div>
    );
}