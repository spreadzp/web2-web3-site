'use client';

import { useState } from "react";

const Collaboration: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submitted:", { name, email, message });
        setName("");
        setEmail("");
        setMessage("");
    };

    return (
        <div className="collaboration">
            <div className="collaboration-left">
                <h2>Collaboration Proposal</h2>
                <p>Description of the collaboration goes here.</p>
            </div>
            <div className="collaboration-right">
                <form onSubmit={handleSubmit} className="collaboration-form">
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Your Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Collaboration;