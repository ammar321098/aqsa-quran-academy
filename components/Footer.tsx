"use client";

export default function Footer() {
  return (
    <footer className="py-20 bg-muted-foreground/20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-semibold mb-2 text-primary">
            Aqsa Quran Academy
          </h4>
          <p className="text-sm">Learn Qur’an with excellence.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">Quick Links</h4>
          <ul className="text-sm space-y-1">
            <li>Courses</li>
            <li>Teachers</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">Follow Us</h4>
          <p className="text-sm">Facebook • YouTube • Instagram</p>
        </div>
      </div>
    </footer>
  );
}
