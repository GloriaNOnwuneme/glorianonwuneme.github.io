/*
 * FOOTER: DISPLAY CURRENT YEAR
 */
function setCopyrightYear() {
  const copyrightYearElement = document.querySelector('#copyright-year');
  if (copyrightYearElement) {
    const currentYear = new Date().getFullYear();
    copyrightYearElement.textContent = currentYear;
  }
}

document.addEventListener('DOMContentLoaded', setCopyrightYear);



/* STORING HEIGHTS OF DETAILS + REFRESHING DATA ONRESIZE*/

            const fetchSkillsHeights = (detailName) => {
                let detes = Array.from(document.querySelectorAll(`details[name=${detailName}] .focus-box`)).map(box => box.getBoundingClientRect().height);
                console.log(detes);
                return detes;
            }
            window.onload = () => {fetchSkillsHeights('skills'); fetchSkillsHeights('services');};
            window.onresize = () => {fetchSkillsHeights('skills'); fetchSkillsHeights('services');};
            







/* ANIMATING DETAILS IN SKILLS/SERVICES */

const detailsGroups = (detailName) => {

    const detailsElements = Array.from(document.querySelectorAll(`[name='${detailName}'] summary`));
    /* getting summary-elements to define click evtListeners below*/
    detailsElements.forEach((btn, i) => {
        let nums = fetchSkillsHeights(detailName);
        console.log('boxheights', nums);
        console.log('btn clicked', i);
    
        btn.addEventListener('click', (e) => {
            e.preventDefault();


            if (detailsElements.some(info => info.parentElement.open)) {
                setTimeout(() => {detailsElements.forEach((sum, i) => {sum.classList.remove('active'); sum.parentElement.removeAttribute("open");});}, 1100); 
            }
            /*
            if (window.matchMedia("(max-width: 767px)").matches) {
            detailsElements.forEach((sum, i) => {sum.classList.remove('active'); sum.parentElement.removeAttribute("open");});
            }
            */

            let varName = `--skillset-height-${detailName}`;

            /* TARGETING .parentElement TO ACCESS DETAILS ELEMENT*/
            btn.parentElement.open 
                ? document.querySelector(':root').style.setProperty(varName, `0px`)
                : document.querySelector(':root').style.setProperty(varName, `${nums[i]}px`);

            if (btn.parentElement.open) {
                setTimeout(() => {btn.parentElement.removeAttribute("open")}, 1100);
            } else {
                btn.classList.add('active');
                if (detailsElements.some(info => info.parentElement.open)) {
                    document.querySelector(':root').style.setProperty(varName, `0px`);
                    setTimeout(() => {document.querySelector(':root').style.setProperty(varName, `${nums[i]}px`); btn.parentElement.open = true;}, 1100);
                } else {
                    setTimeout(() => {btn.parentElement.open = true;}, 500); /* SEE IF DELAY TOO SHORT FOR MOBILES, EVEN IF ALL DETAILS CLOSED HERE*/
                }
                
            }

        });
    });
}

/*running details animation function for separate .skills-nav elements*/
detailsGroups('skills');
detailsGroups('services');


    const hamburgerButton = document.querySelector('#hamburger-button');
    const navLinksContainer = document.querySelector('#nav-links-container');

    hamburgerButton.addEventListener('click', function() {
        hamburgerButton.classList.toggle('open');
        navLinksContainer.classList.toggle('open');
    });

    navLinksContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('nav-link')) {
            /* HIDE MOBILE MENU + RESET MENU BTN APPEARANCE IF ANY .nav-link CLICKED WITHIN MENU*/
            navLinksContainer.classList.remove('open');
            hamburgerButton.classList.remove('open');
        }
    });


    /* PROJECTS SECTION - PICKING PROJECT TO BE DISPLAYED */
    const projectButtons = document.querySelectorAll('[data-control-btn]');
    const projectSlides = document.querySelectorAll('.projects-slide'); 

function setActiveProject(targetSlideId) {
    projectSlides.forEach(slide => {
        slide.classList.remove('show');
    });

    /* RESETTING APPEARANCE OF 'PROJECT TABS' */
    projectButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    const targetSlide = document.querySelector(`#${targetSlideId}`);
    if (targetSlide) {
        targetSlide.classList.add('show');
    }

    const targetButton = document.querySelector(`[data-control-btn="${targetSlideId}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }
}

projectButtons.forEach(button => {
    button.addEventListener('click', function() {
        const targetSlideId = this.getAttribute('data-control-btn');
        setActiveProject(targetSlideId);
        document.querySelector(`#${targetSlideId}`).scrollIntoView();

    });
});



/* HEADER ANIMATING INTO VIEW ONSCROLL AS SOON AS HOMEPAGE FULLY OUT OF VIEW*/
const targetElement = document.querySelector('#homepage');
const elementToToggle = document.querySelector('header');

const options = {
    root: null, 
    rootMargin: '0px',
    threshold: .2 /*i.e. 20% of #homepage to be in view within viewport*/
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) { // meaning if target element, i.e. homepage, is in view (even slightly)

            elementToToggle.classList.remove('header-appear');
        } else {
            elementToToggle.classList.add('header-appear');
        }
    });
}, options);

// Start observing the target element
observer.observe(targetElement);







/* ENTRY-ANIMATIONS FOR LARGER SECTIONS*/

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -20% 0px', /* OBSERVATION 'FRAME' EXCLUDES BOTTOM 20% OF VIEWPORT*/
        threshold: 0
    };

    // A Map to keep track of elements that have triggered their actions
    // This helps prevent re-triggering (NB:unobserve is primary mechanism)
    const processedElements = new Map();

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= observerOptions.threshold) {

                // If this element has already been processed (i.e. animated once since window load), skip it
                if (processedElements.has(entry.target)) {
                    return;
                }

                entry.target.style.setProperty('opacity', '1', 'important');

                // Step 2: Set a timeout to remove the entry-anim class after 750ms (= transition duration)
                const timeoutId = setTimeout(() => {
                    entry.target.classList.remove('entry-fade');
                    processedElements.delete(entry.target); // Clean up map with each entry
                }, 1500);

                /* BEFORE NEXT ROUND OF MAP CLEANUP: Mark the element as processed and store its timeout ID */
                processedElements.set(entry.target, timeoutId);

                // Stop observing this element immediately to prevent re-triggering
                observer.unobserve(entry.target);
            }

        });
    }, observerOptions);

    const elementsToObserve = document.querySelectorAll('.entry-fade');

    elementsToObserve.forEach(element => {
        fadeObserver.observe(element);
    });






/* FOOTER-APPEAR-ON-SCROLL*/


let headerObserver = null; // Variable to store the Intersection Observer instance


function setupHeaderFooterObserver() {
  const headerEl = document.querySelector('header');
  const footerEl = document.querySelector('footer'); 

  // --- Step 1: Clean up any existing observer ---
  if (headerObserver) {
    headerObserver.disconnect();
    headerObserver = null; // Clear the reference

    // Ensure the class is removed when disconnecting, to clean up UI state
    if (headerEl && headerEl.classList.contains('scrolled-past-footer')) {
      headerEl.classList.remove('scrolled-past-footer');
    }
  }

  // --- Step 2: Check conditions for activating the observer ---
  if (!headerEl || !footerEl || window.innerWidth <= 768) {
    return; // NO-GO IF EVEN ONE OF CONDITIONS DON'T APPLY
  }

  // --- Step 3: Initialize the observer if conditions are met ---

  // Get the height of the header dynamically, to tweak 'rootMargin'
  const headerHeight = headerEl.offsetHeight;

  const observerOptions = {
    root: null, // The viewport is the root container
    rootMargin: `0px 0px -${headerHeight}px 0px`,
    threshold: 0 // Trigger the callback as soon as any part of the target crosses the rootMargin boundary
  };

  const intersectionCallback = (entries) => {
    entries.forEach(entry => {

        if (entry.isIntersecting) {
        headerEl.classList.add('scrolled-past-footer');
      } else {
        headerEl.classList.remove('scrolled-past-footer');
      }
    });
  };

  headerObserver = new IntersectionObserver(intersectionCallback, observerOptions);

  headerObserver.observe(footerEl);
}

// --- Event Listeners for initial setup and resize handling ---

document.addEventListener('DOMContentLoaded', setupHeaderFooterObserver);

// Re-check and re-setup observer on window resize.
// Using a debounce to prevent excessive calls during rapid resizing.
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(setupHeaderFooterObserver, 200); // Debounce for 200ms
});







/*COPY EMAIL WHEN CLICKING 'CONTACT' BTN - TO AVOID OPENING RANDOM EMAIL CLIENT => CAN PASTE WHEREVER YOU WILL*/

    const popup = document.querySelector('#popup');
    const emailErrorPopup =  document.querySelector('#email-error-popup');
    const emailLinks = Array.from(document.querySelectorAll('.email-link'));

    emailLinks.forEach(emailLink => {
        emailLink.addEventListener('click', async (event) => {
            event.preventDefault();

            const emailAddress = emailLink.href ? emailLink.href.slice(7) : '';

            if (emailAddress) {
                try {
                await navigator.clipboard.writeText("gn.onwuneme@yahoo.com");

                    popup.classList.add('email-copied-confirm');

                    /* AUTO-HIDE POPUP */
                    setTimeout(() => {
                        popup.classList.remove('email-copied-confirm');
                    }, 2000);

                } catch (err) {
                    console.error('Failed to copy email: ', err);
                    emailErrorPopup.classList.add('email-copied-confirm');

                    /* AUTO-HIDE POPUP */
                    setTimeout(() => {
                        emailErrorPopup.classList.remove('email-copied-confirm');
                    }, 2000);

                }
            } else {
                console.warn('No email address found in href for this .email-link element.');
            }
        });
    });

