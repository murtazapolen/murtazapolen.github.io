import React from 'react';
import Card from './Card';
import RulerHeader from './RulerHeader';

export default function ContactCard() {
  return (
    <Card>
      <RulerHeader />
      <div className="contact-section">
        <h2>Get in Touch</h2>
        <p className="contact-subtitle">Capture contact info & get a call back, or reach out directly.</p>
        
        <form action="https://formsubmit.co/polenmurtaza@gmail.com" method="POST" className="contact-form">
          {/* FormSubmit Configuration Options */}
          <input type="hidden" name="_subject" value="New Contact Request from Portfolio" />
          <input type="hidden" name="_captcha" value="false" />
          
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="Name" placeholder="Your Name" required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="Phone" placeholder="+91" required />
          </div>
          <div className="form-group">
            <label>Message (Optional)</label>
            <textarea name="Message" rows="3" placeholder="How can we help you?"></textarea>
          </div>
          <button type="submit" className="submit-btn">Request Callback</button>
        </form>

        <div className="contact-direct">
          <h3>Contact Me</h3>
          <p>
            📞 <a href="tel:+919766404400" style={{ color: 'inherit', textDecoration: 'none' }}>+91-9766404400</a>
          </p>
          <p>
            ✉️ <a href="mailto:polenmurtaza@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>polenmurtaza@gmail.com</a>
          </p>
        </div>
      </div>
    </Card>
  );
}
