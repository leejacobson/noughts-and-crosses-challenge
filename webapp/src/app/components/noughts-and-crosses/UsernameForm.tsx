import { createUser, getInfo } from "@/app/api/client";
import { FormEvent, useState } from "react";

type Props = {
    setUsername: (username: string) => void;
}

export default function UsernameForm({ setUsername }: Props) {
    const [usernameInputVal, setUsernameInputVal] = useState<string>('')

    const submitForm = async (e: FormEvent) => {
        e.preventDefault()
        setUsername(usernameInputVal)
    }

    return (
        <form onSubmit={submitForm}>
            <h2><label htmlFor="username-input">Enter username:</label></h2>
            <input id="username-input" type="text" value={usernameInputVal} onChange={(e) => setUsernameInputVal(e.target.value)} />
            <button>Play</button>
        </form>
    )
}
