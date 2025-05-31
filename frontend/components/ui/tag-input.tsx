"use client";
import React, { useState } from "react";
import { Input } from "./input";

function TagInput() {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) =>
    setTags(tags.filter((_, i) => i !== index));

  return (
    <div className="grid gap-2 w-full">
      <Input
        type="text"
        placeholder="Enter tags..."
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
      />
      <div className="flex flex-wrap gap-1">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 shadow-xs rounded-full px-3 py-1 text-black dark:text-white flex items-center gap-2"
          >
            {tag}
            <button
              type="button"
              className="cursor-pointer hover:opacity-50"
              onClick={() => removeTag(index)}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default TagInput;
