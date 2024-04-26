import { useState } from "react";
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { address: string; amount: string }) => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSubmit({ address, amount });
        onClose();
    };

    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <form onSubmit={handleSubmit}>
                    <label>
                        Address:
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </label>
                    <label>
                        Amount:
                        <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </label>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};