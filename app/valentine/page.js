"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function ValentinePage() {
  const router = useRouter();
  const [dayIndex, setDayIndex] = useState(0);
  const [unlockedDays, setUnlockedDays] = useState(0);
  const [currentDate, setCurrentDate] = useState("");
  const [dateInfo, setDateInfo] = useState("");
  const [isBeforeStart, setIsBeforeStart] = useState(false);
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [calendarAdded, setCalendarAdded] = useState(false);
  const [showFinalLetter, setShowFinalLetter] = useState(false);

  const days = [
    { title: "Rose Day 🌹", msg: "If I could give you a rose for every time you crossed my mind, you’d be walking through a garden that never ends. 🌹Like this rose, my love for you keeps blooming — soft, beautiful, and endless.", date: "Feb 7" },
    { title: "Propose Day 💍", msg: "In a world full of choices, my heart chooses you — today, tomorrow, and in every lifetime after that. 💍If loving you is a dream, I never want to wake up.", date: "Feb 8" },
    { title: "Chocolate Day 🍫", msg: "They say chocolate makes life sweeter…but clearly they haven’t met you yet. 🍫Because every moment with you tastes like happiness I never knew I needed.", date: "Feb 9" },
    { title: "Teddy Day 🧸", msg: "If I could, I’d turn into the softest teddy bear in the world… just so I could stay in your arms forever. 🧸Until then, imagine every hug from me wrapped inside this little message.", date: "Feb 10" },
    { title: "Promise Day 🤝", msg: "I can’t promise a life without problems… but I promise you’ll never face them alone. 🤝My hand will always find yours, no matter what life brings.", date: "Feb 11" },
    { title: "Hug Day 🤗", msg: "Close your eyes for a second… That warmth you feel? That’s my hug finding its way to you. 🤗If I were there right now, I’d never let go.", date: "Feb 12" },
    { title: "Kiss Day 😘", msg: "If kisses could travel through screens, yours would be on your forehead right now — soft, gentle, full of love. 😘Saving the rest for when I see you.", date: "Feb 13" },
    { title: "Valentine's Day ❤️", msg: "Loving you isn’t just my favorite feeling — it’s my favorite place to be. ❤️Every laugh, every moment, every heartbeat feels better because it’s with you.Today isn’t special because it’s Valentine’s Day… It’s special because I get to love you.", date: "Feb 14" }
  ];

  useEffect(() => {
    if (!localStorage.getItem("valentineAccepted")) {
      router.push("/");
      return;
    }

    // Set start date to midnight LOCAL time (not UTC)
    const startDate = new Date(2026, 1, 7); // Month is 0-indexed: 1 = February
    const today = new Date();
    
    // Display current device date and time
    const dateOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    setCurrentDate(today.toLocaleDateString('en-US', dateOptions));
    
    const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    // Check if we're before the start date
    if (diffDays < 0) {
      setIsBeforeStart(true);
      const daysUntil = Math.abs(diffDays);
      setDateInfo(`Valentine week starts in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}! 💝`);
    } else {
      setIsBeforeStart(false);
      // Calculate how many days are unlocked (0 to 7)
      const unlocked = Math.min(Math.max(diffDays, 0), days.length - 1);
      setUnlockedDays(unlocked);
      
      // Set informative message based on date
      if (diffDays >= 0 && diffDays < days.length) {
        setDateInfo(`${unlocked + 1} of ${days.length} days unlocked 🔓`);
      } else {
        setDateInfo(`All ${days.length} days unlocked! 💖`);
      }
    }
  }, [router, days.length]);

  const handleAddToCalendar = async () => {
    if (!gapiLoaded) {
      alert("Google Calendar is loading, please try again in a moment.");
      return;
    }

    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/calendar.events',
        callback: async (tokenResponse) => {
          if (tokenResponse.access_token) {
            await createCalendarEvent(tokenResponse.access_token);
          }
        },
      });

      tokenClient.requestAccessToken();
    } catch (error) {
      console.error('Error with Google Calendar:', error);
      // Fallback to Google Calendar web link
      openGoogleCalendarWeb();
    }
  };

  const createCalendarEvent = async (accessToken) => {
    try {
      const event = {
        summary: '💝 Valentine Week Begins!',
        description: 'Your special Valentine messages start today! Visit your Valentine website to see the first message.',
        start: {
          dateTime: '2026-02-07T00:00:00',
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: '2026-02-07T23:59:59',
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 0 },
            { method: 'email', minutes: 60 },
          ],
        },
      };

      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (response.ok) {
        setCalendarAdded(true);
        alert('✅ Event added to your Google Calendar with reminders!');
      } else {
        throw new Error('Failed to create event');
      }
    } catch (error) {
      console.error('Error creating calendar event:', error);
      openGoogleCalendarWeb();
    }
  };

  const openGoogleCalendarWeb = () => {
    // Fallback: Open Google Calendar with pre-filled event
    const title = encodeURIComponent('💝 Valentine Week Begins!');
    const details = encodeURIComponent('Your special Valentine messages start today!');
    const dates = '20260207/20260207';
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}`;
    window.open(url, '_blank');
    setCalendarAdded(true);
  };

  const nextDay = () => {
    if (dayIndex < unlockedDays && dayIndex < days.length - 1) {
      setDayIndex(dayIndex + 1);
    } else if (dayIndex === 7 && unlockedDays >= 7) {
      // After Valentine's Day (day 8), show the final letter
      setShowFinalLetter(true);
    }
  };

  const prevDay = () => {
    if (dayIndex > 0) {
      setDayIndex(dayIndex - 1);
    }
  };

  return (
    <>
      <Script 
        src="https://accounts.google.com/gsi/client" 
        onLoad={() => setGapiLoaded(true)}
      />
      
      {showFinalLetter ? (
        <div className="letter-wrapper">
          <div className="letter">
            <div className="letter-header">My Chahu,</div>
            
            <p>If you are reading this, it means you've reached the final page of our little Valentine story… but this isn't the end. It's the beginning of something I want forever.</p>
            
            <p>There was a time in my life when everything felt heavy.<br/>
When I was tired of trying, tired of hoping, tired of believing that things could ever truly get better. I was moving forward, but without direction — existing, not living.</p>
            
            <p>And then… you walked into my life.<br/>
Not with fireworks. Not with noise.<br/>
But with a calm light that slowly made everything feel possible again.</p>
            
            <p>You didn't just make me smile —<br/>
you reminded me why I should.</p>
            
            <p>The way you care, the way you listen, the way you simply are… it changed something inside me. Loving you didn't feel like falling. It felt like finally finding my way home.</p>
            
            <p>You came into my life at a time when I was ready to give up on so many things…<br/>
and somehow, just by being you, you gave me a reason to try again.<br/>
A reason to work harder.<br/>
A reason to dream bigger.<br/>
A reason to build a future that feels warm, safe, and full of laughter — with you in it.</p>
            
            <p>Every step I take toward becoming something better,<br/>
every late night working,<br/>
every plan for tomorrow…<br/>
carries one quiet thought in my heart:<br/>
<em>"I want to build a life where she never has to worry, only smile."</em></p>
            
            <p>You are not just someone I love.<br/>
You are my peace on difficult days,<br/>
my motivation when I feel lost,<br/>
my happiness in its purest form.</p>
            
            <p>I cannot imagine my life without you in it.<br/>
Not the small moments.<br/>
Not the big dreams.<br/>
Not the future I'm working so hard to create.</p>
            
            <p>If life is a long journey,<br/>
I don't just want you beside me —<br/>
I want to walk every road with your hand in mine.</p>
            
            <p>Thank you for coming into my life when I needed someone the most.<br/>
Thank you for being my light when things felt dark.<br/>
Thank you for being you.</p>
            
            <p>And if you ever wonder how much you mean to me…<br/>
just know this —<br/>
Loving you is the best decision my heart ever made.</p>
            
            <div className="letter-signature">
              Forever yours,<br/>
              Guddu ❤️
            </div>
            
            <button onClick={() => setShowFinalLetter(false)} className="back-to-days-btn">
              ← Back to Messages
            </button>
          </div>
        </div>
      ) : (
        <main className="center valentine-page">
          <div className="date-display">
            📅 {currentDate}
          </div>
          
          {isBeforeStart ? (
            <div className="message-card waiting-card">
              <div className="unlock-status waiting-status">
                {dateInfo}
              </div>
              
              <h1>Your Valentine Surprise Awaits! 💝</h1>
              <p className="message">
                Something beautiful has been written in the stars just for you, my princess… 🌙✨ But the most preci  ous moments are worth waiting for.
                <br/><br/>
                <strong>Chahu</strong>, come back on <strong>February 7th, 2026</strong> to unlock the first piece of my heart waiting here for you. 💌 From <strong>Feb 7th to 14th</strong>, a new little love note will bloom each day — made only for you. 🌹 
                <br/><br/>
                On <strong>February 7th, 2026</strong>, and the first page of our Valentine story will open. 📖 Each day after that, a new chapter of love will appear until <strong>February 14th</strong>. 🌷✨
              </p>
              
              <div className="countdown-card">
                <div className="countdown-emoji">⏰</div>
                <button 
                  onClick={handleAddToCalendar} 
                  className="calendar-btn"
                  disabled={calendarAdded}
                >
                  {calendarAdded ? '✓ Added to Calendar!' : '📅 Mark your calendar!'}
                </button>
              </div>
            </div>
          ) : (
          <div className="message-card">
            <div className="unlock-status">
              {dateInfo}
            </div>
            
            <h1>{days[dayIndex].title}</h1>
            <div className="day-date">{days[dayIndex].date}, 2026</div>
            <p className="message">{days[dayIndex].msg}</p>
            
            <div className="progress-indicator">
              Day {dayIndex + 1} of {days.length}
            </div>

            <div className="navigation">
              {dayIndex > 0 && (
                <button onClick={prevDay} className="nav-btn">← Previous 💕</button>
              )}
              
              {dayIndex < unlockedDays && dayIndex < days.length - 1 ? (
                <button onClick={nextDay} className="nav-btn">Next 💖 →</button>
              ) : dayIndex === 7 && unlockedDays >= 7 ? (
                <button onClick={nextDay} className="nav-btn final-letter-btn">Open Final Letter 💌</button>
              ) : dayIndex === days.length - 1 ? (
                <button disabled className="nav-btn locked">All Messages Read ❤️</button>
              ) : (
                <button disabled className="nav-btn locked">Come back tomorrow 💌</button>
              )}
            </div>
          </div>
        )}
      </main>
      )}
    </>
  );
}
