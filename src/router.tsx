import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import {
    Home,
    BattleLobby,
    BattleRoom,
    Vaults,
    VaultDetail,
    AIArchitect,
    Rank,
    UserProfile,
    StrategyResult,
} from "./pages";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "battle",
                element: <BattleLobby />,
            },
            {
                path: "battle/:id",
                element: <BattleRoom />,
            },
            {
                path: "vaults",
                element: <Vaults />,
            },
            {
                path: "vaults/:id",
                element: <VaultDetail />,
            },
            {
                path: "ai-architect",
                element: <AIArchitect />,
            },
            {
                path: "strategy/result",
                element: <StrategyResult />,
            },
            {
                path: "rank",
                element: <Rank />,
            },
            {
                path: "profile/:id",
                element: <UserProfile />,
            },
        ],
    },
]);
