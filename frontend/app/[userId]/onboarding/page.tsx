import React from "react";
import Image from "next/image";
import Logo from "../../../public/Notex_Logo.svg";
import Create from "../../../public/create_photo.png";
import Note from "../../../public/notes-image.png";

export default function OnboardingPage() {
  return (
    <section className="p-6 flex flex-col items-center h-full">
      <div className="max-w-3xl">
        <div className="flex items-center gap-4 border border-transparent border-b-neutral-200 p-3">
          <Image src={Logo} width={70} height={70} alt="Notex Logo" />
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-5xl">Welcome to Notex!</h1>
            <p className="text-sm pl-1">
              Notex is a note-taking app that allows you to create, organize,
              and share your notes with ease.
            </p>
          </div>
        </div>
        <div className=" w-full flex items-center justify-between p-3 pt-7">
          <div className="w-2/3">
            <h2 className="font-semibold text-xl"> Upload Notes for Point</h2>
            <p className="text-sm">
              Click the Create tab in the sidebar. Enter your note title (e.g.,
              “Fall quarter 2024”) and course name (e.g., “CSEN 146”). Then
              click Choose File to upload your note from your computer. Once
              selected, click the black Create Note button to save it. You’ll
              earn 1 point for each note you upload.
            </p>
          </div>

          <Image
            src={Create}
            className="w-52 rotate-3 shadow-md rounded-2xl"
            alt="Create Notes"
          />
        </div>
        <div className=" w-full flex items-center justify-between p-3 pt-6">
          <div className="w-2/3">
            <h2 className="font-semibold text-xl">
              {" "}
              Unlock to View other Notes
            </h2>
            <p className="text-sm">
              You can unlock and view other users’ notes by spending points,
              each unlock requires 1 point. Earn points by uploading your own
              notes or through other means. Access available notes by clicking
              on the “Notes” tab in the sidebar. Unlocking is not restricted to
              users who have uploaded notes; as long as you have points, you can
              unlock and view others’ notes.
            </p>
          </div>

          <Image
            src={Note}
            className="w-44 -rotate-4 shadow-md rounded-2xl"
            alt="Create Notes"
          />
        </div>
        <div className=" w-full flex items-center justify-between p-3 pt-6">
          <div className="w-2/3">
            <h2 className="font-semibold text-xl"> Comment and Rate Notes</h2>
            <p className="text-sm">
              You can comment on and rate notes you unlock. This helps other
              users find high-quality notes. To comment, click on the note you
              want to comment on, scroll down to the comments section, and enter
              your comment. To rate a note, click the star rating below the note
              title. Your feedback is valuable to the community!
            </p>
          </div>
          <Image
            src={Create}
            className="w-52 rotate-3 shadow-md rounded-2xl"
            alt="Create Notes"
          />
        </div>
        <div className=" w-full flex items-center justify-between p-3 pt-6">
          <div className="w-2/3">
            <h2 className="font-semibold text-xl">
              {" "}
              Create Like Notes Collection
            </h2>
            <p className="text-sm">
              When you like a note from another user, it will be saved in your
              Likes tab in the sidebar. All notes you like are collected there
              for easy access, so you can quickly find and revisit your favorite
              notes at any time. You can only like a note after you have
              unlocked it.
            </p>
          </div>
          <Image
            src={Create}
            className="w-52 -rotate-3 shadow-md rounded-2xl"
            alt="Create Notes"
          />
        </div>
      </div>
    </section>
  );
}
