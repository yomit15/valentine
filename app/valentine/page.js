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

  const days = [
    { title: "Rose Day 🌹", msg: "Like this rose, my love keeps blooming.", date: "Feb 7" },
    { title: "Propose Day 💍", msg: "I'd choose you in every lifetime.", date: "Feb 8" },
    { title: "Chocolate Day 🍫", msg: "Life with you is sweeter than chocolate.", date: "Feb 9" },
    { title: "Teddy Day 🧸", msg: "If I could, I'd hug you forever.", date: "Feb 10" },
    { title: "Promise Day 🤝", msg: "I promise to stand by you always.", date: "Feb 11" },
    { title: "Hug Day 🤗", msg: "A virtual hug until I can give a real one.", date: "Feb 12" },
    { title: "Kiss Day 😘", msg: "Saving all my kisses for you.", date: "Feb 13" },
    { title: "Valentine's Day ❤️", msg: "Every day with you is my favorite day.", date: "Feb 14" }
  ];

  useEffect(() => {
    if (!localStorage.getItem("valentineAccepted")) {
      router.push("/");
      return;
    }

    const startDate = new Date("2026-02-07");
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
              Something special is waiting for you, but good things come to those who wait...
              <br/><br/>
              Come back on <strong>February 7th, 2026</strong> to unlock your first message! 
              <br/><br/>
              Each day from Feb 7-14, a new romantic message will be revealed just for you. ✨
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
            ) : dayIndex === days.length - 1 ? (
              <button disabled className="nav-btn locked">All Messages Read ❤️</button>
            ) : (
              <button disabled className="nav-btn locked">Come back tomorrow 💌</button>
            )}
          </div>
        </div>
      )}
    </main>
    </>
  );
}
