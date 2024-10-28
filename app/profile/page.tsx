import ProfileForm from "@/components/profile/profile-form";

export default function ProfilePage() {
  return (
    <div className="container max-w-screen-xl mx-auto py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        <ProfileForm />
      </div>
    </div>
  );
}