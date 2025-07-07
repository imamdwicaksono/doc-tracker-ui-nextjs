import React from "react";

interface NavbarMobileProps {
  form: { privacy: string };
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function NavbarMobile({ form, handleChange }: NavbarMobileProps) {
  return (
    <select
      name="privacy"
      onChange={e => handleChange(e)}
      className="w-full p-2 border rounded"
      value={form.privacy}
    >
      <option value="">Select Privacy</option>
      <option value="public">Public</option>
      <option value="private">Private</option>
    </select>
  );
}