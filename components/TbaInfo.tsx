import { useTbaSiteStore } from "../hooks/store";

type TbaInfoProps = {
    isDeployed: boolean
}
export const TbaInfo: React.FC<TbaInfoProps> = ({ isDeployed }) => {

    const {
        TBAccount,
        retrievedAccount
    } = useTbaSiteStore();
    return (
        <>
            <div className="text-orange-300">
                <div>Tba account {retrievedAccount} is {isDeployed ? 'deployed' : 'not deployed yet'} </div>
                <div> for token {TBAccount.tokenContract} with tokenId {TBAccount.tokenId}</div>
            </div>
        </>
    )
}