import { Star } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6" />
              <span className="text-xl font-bold">Jewish Network State</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Building a digital home for the global Jewish community
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>About Us</li>
              <li>Community</li>
              <li>Torah Study</li>
              <li>Governance</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>Documentation</li>
              <li>Help Center</li>
              <li>Guidelines</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>Twitter</li>
              <li>Discord</li>
              <li>Telegram</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Jewish Network State. All rights reserved.
        </div>
      </div>
    </footer>
  );
}