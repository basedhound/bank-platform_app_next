import HeaderBox from "@/components/shared/HeaderBox";
import RecentTransactions from "@/components/shared/RecentTransactions";
import RightSidebar from "@/components/shared/RightSidebar";
import TotalBalanceBox from "@/components/shared/TotalBalanceBox";
//
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();

  // Fetch user's bank accounts
  const accounts = await getAccounts({
    userId: loggedIn.$id,
  });
  if (!accounts) return;

  // Rename data
  const accountsData = accounts?.data;

  // Fetch the ID of that account in the database
  const appwriteItemId = (id as string) || accounts?.data[0]?.appwriteItemId;

  // Finally
  const account = await getAccount({ appwriteItemId });

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || "Guest"}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>

        {
          <RecentTransactions
            accounts={accountsData}
            transactions={account?.transactions}
            appwriteItemId={appwriteItemId}
            page={currentPage}
          />
        }
      </div>

      <RightSidebar
        user={loggedIn}
        transactions={account?.transactions}
        banks={accountsData?.slice(0, 2)}
      />
    </section>
  );
};

export default Home;
