'use client';
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function PasswordInput({ name = 'password', placeholder = 'Password' }) {
const [show, setShow] = useState(false);
return (
<div className="relative">
<input name={name} type={show ? 'text' : 'password'} required placeholder={placeholder} className="input input-bordered w-full pr-12" />
<button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}
className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 transition-colors hover:text-primary">
{show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
</button>
</div>
);
}