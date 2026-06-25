import React from 'react';
import reviewsData from './data/reviews.json';
import Navigation from './components/Navigation';
import Card from './components/Card';
import RulerHeader from './components/RulerHeader';
import InstagramHeader from './components/InstagramHeader';
import ProfileIntro from './components/ProfileIntro';
import PhotoGrid from './components/PhotoGrid';
import BiographyText from './components/BiographyText';
import ReviewBlock from './components/ReviewBlock';
import Footer from './components/Footer';
import ContactCard from './components/ContactCard';
import WhatsAppButton from './components/WhatsAppButton';

function MainSite() {
  const defaultPhotos = [
    "/images/aboutme/Murtu%204.0-3.jpg",
    "/images/aboutme/Murtu-10.jpg",
    "/images/aboutme/Murtu-9.jpg",
    "/images/aboutme/Murtu-20.jpg",
    "/images/aboutme/Murtu%204.0-5.jpg"
  ];

  return (
    <div className="app-wrapper">
      <WhatsAppButton />
      <Navigation />

      <main className="content-container">
        {/* ABOUT ME SECTION */}
        <section id="about">
          {/* Original Card */}
          <Card>
            <RulerHeader />
            <ProfileIntro />
            <PhotoGrid photos={defaultPhotos.slice(0, 1)} layoutClass="layout-single" />
            <BiographyText />
          </Card>

          {/* Card 1 (Instagram + Bio text) */}
          <Card>
            <RulerHeader />
            <InstagramHeader />
            <PhotoGrid photos={defaultPhotos.slice(0, 5)} layoutClass="layout-1" />
            <BiographyText>
              <p>
                He has been committed to giving equal amounts of time to his interior practice & experimenting with sustainable & upcycled products. Infact, that guy himself has been paperless since past 5 years & lives in an upcycled studio. Interiorwala has hitch hiked around the country & has adapted a lot of these forms and techniques from his travels to his work and purchases.
              </p>
              <p>
                Practicing organic design for him is more of emotion than money. He believes and is known for having long term relationships with his clients, vendors, & his team. His sites always have a hint of local talent & artisans rather than any branded statement pieces. Choosing quality over quantity allows him to personally take care of every detail & communication himself without any design staff thus, giving 100% personal attention to his clients' choices and that of their projects resulting into on time deliveries within the given budget.
              </p>
            </BiographyText>
          </Card>

          {/* Card 2 (Instagram + Default layout) */}
          {/* <Card>
            <RulerHeader />
            <InstagramHeader />
            <PhotoGrid photos={defaultPhotos.slice(0, 5)} layoutClass="layout-2" />
            <BiographyText>
              <p>
                Practicing organic design for him is more of emotion than money. He believes and is known for having long term relationships with his clients, vendors, & his team. His sites always have a hint of local talent & artisans rather than any branded statement pieces. Choosing quality over quantity allows him to personally take care of every detail & communication himself without any design staff thus, giving 100% personal attention to his clients' choices and that of their projects resulting into on time deliveries within the given budget.
              </p>
            </BiographyText>
          </Card> */}
        </section>

        {/* REVIEWS SECTION */}
        <section id="reviews">
          {reviewsData.map((review, index) => (
            <Card key={index}>
              <RulerHeader />
              <InstagramHeader />
              <PhotoGrid
                photos={review.photos || defaultPhotos.slice(0, 5)}
                layoutClass="layout-dynamic"
              />
              <ReviewBlock reviewData={{
                initial: review.name ? review.name.charAt(0).toUpperCase() : 'U',
                name: review.name,
                reviewsCount: review.reviewsCount,
                time: review.time,
                rating: review.rating,
                positiveTags: review.positiveTags,
                text: review.text
              }} />
            </Card>
          ))}
        </section>

        {/* CONTACT SECTION */}
        <section id="contact">
          <ContactCard />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default MainSite;
