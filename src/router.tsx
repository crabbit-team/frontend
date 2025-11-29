import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import {
    Home,
    BattleLobby,
    BattleRoom,
    Vaults,
    VaultDetail,
    AIAssist,
    Rank,
    UserProfile,
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
                path: "ai-assist",
                element: <AIAssist />,
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
