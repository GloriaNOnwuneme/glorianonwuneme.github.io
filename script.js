/**/	document.onreadystatechange = () => {


		if (document.readyState == "complete") {
			if (document.querySelector('#loading-div')) {
				document.querySelector('#loading-div').classList.add("remove-div");
				setTimeout(() => {document.querySelector("#loading-div").remove()}, 200);
			}
		}
	}



	const copyEmail = (e) => {
		event.preventDefault();
		let text = e.target.href.replace('mailto:', '');
		navigator.clipboard.writeText(text)
		.then(navigator.clipboard.readText());
	}

	document.querySelectorAll(".email-btn").forEach(btn => btn.addEventListener("click", copyEmail));


	function buildingThresholds() {
		let thresholds = [];
		for (let i = 0; i < 1000; i++) {
			thresholds.push(i/1000);
		}

		return thresholds;
	}


function headerAppear() {
	createObserver();

	function createObserver() {
		let observer;
		
		let options = {
			rootMargin: "-64px 0px 0px 0px",
			threshold: buildingThresholds(),
		};

		observer = new IntersectionObserver(handleIntersect, options);
		observer.observe(document.querySelector("section:first-of-type"));
	}


	function handleIntersect(entries, observer) {
		entries.forEach((entry) => {
			if (entry.intersectionRatio <= 0) {
				document.querySelector("header").classList.add("header-appear");
			} else {
				document.querySelector("header").classList.remove("header-appear");
			}
		});
	}
}


window.addEventListener("resize", headerAppear);
window.addEventListener("load", headerAppear);



function sectionsAppear() {
	createObserver();

	function createObserver() {
		let observer;
		
		let options = {
			threshold: buildingThresholds(),
		};

		observer = new IntersectionObserver(handleIntersect, options);
		let sections = Array.from(document.querySelectorAll("section:not(:first-of-type)"));
		sections.forEach((block, i) => {
			sections[i] = [block, ...Array.from(block.querySelectorAll(".fade-in"))];
		});
		sections = sections.flat();
		sections.forEach((section) => observer.observe(section));
	}



	let num = 0;

	function handleIntersect(entries, observer) {
		entries.forEach((entry) => {
			if ((entry.boundingClientRect.top < .8 * window.innerHeight) || entry.intersectionRatio > .7) {
				if (entry.target.tagName === "section") {
					num = 0;
					entry.target.classList.replace("fade-in","opacity-max");
				} else {
					num++;
					let interval = num*50;
					setTimeout(() => {entry.target.classList.replace("fade-in","appear")}, interval);
				}
			}

		});
	}
}


window.addEventListener("resize", sectionsAppear);
window.addEventListener("load", sectionsAppear);
window.addEventListener("scroll", sectionsAppear);

/**/

const scrollerCtns = el => {
	let carousel = document.querySelector(`#${el}`);
	let btns = Array.from(carousel.parentElement.querySelectorAll(".control-btn"));
	let slides = Array.from(carousel.children);
		
	setTimeout(() => {

		(slides[slides.length - 1].getBoundingClientRect().right - .5*slides[slides.length - 1].getBoundingClientRect().width <= window.innerWidth) 
			? btns[1].classList.add("hide") 
			: btns[1].classList.remove("hide");
		
		(slides[0].getBoundingClientRect().left + .5*slides[0].getBoundingClientRect().width >= carousel.getBoundingClientRect().left) 
			? btns[0].classList.add("hide")
			: btns[0].classList.remove("hide");
	},500);



	let inView = slides.findIndex(slide => (slide.getBoundingClientRect().left + .5*slide.getBoundingClientRect().width >= carousel.getBoundingClientRect().left) && (slide.getBoundingClientRect().right - .5*slide.getBoundingClientRect().width  <= window.innerWidth));

	if (carousel.parentElement.querySelector("#indicator-buttons")) {let indicators = Array.from(carousel.parentElement.querySelector("#indicator-buttons").children); indicators.forEach((indicator, i) => {(i == inView) ? indicator.classList.add("opacity-max") : indicator.classList.remove("opacity-max");})}

/**/
if (slides[0].querySelector(".sample-desc")) {
	slides.forEach((slide,i) => {(i == inView) ? slide.querySelector(".sample-desc").classList.add("appear") : slide.querySelector(".sample-desc").classList.remove("appear");});
}


}

scrollerCtns("nav-scroller");
scrollerCtns("carousel-ctn");

document.querySelector("#nav-scroller").addEventListener("scrollend", () => {scrollerCtns("nav-scroller");});
document.querySelector("#carousel-ctn").addEventListener("scrollend", () => {scrollerCtns("carousel-ctn");});


const scrollerBtn = (e) => {
	let carousel = e.target.parentElement.querySelector(".carousel");
	let slideWidth = Array.from(carousel.children)[0].getBoundingClientRect().width;

	if (e.target.classList.contains("left")) {carousel.scrollBy(-slideWidth, 0);} else {carousel.scrollBy(slideWidth,0);}
}

Array.from(document.querySelector("#nav-scroller").parentElement.querySelectorAll(".control-btn")).forEach(btn => btn.addEventListener("click", scrollerBtn));
Array.from(document.querySelector("#carousel-ctn").parentElement.querySelectorAll(".control-btn")).forEach(btn => btn.addEventListener("click", scrollerBtn));


const indicatorClicks = () => {
	let slides = Array.from(document.querySelectorAll("#carousel-ctn > div"));
	let btns = Array.from(document.querySelector("#indicator-buttons").children);
	let index = btns.indexOf(event.target);
	slides[index].scrollIntoView();
	
	btns.forEach((btn, i) => {(i == index) ? btn.classList.add("opacity-max") : btn.classList.remove("opacity-max");});
}

Array.from(document.querySelector("#indicator-buttons").children).forEach(btn => btn.addEventListener("click", indicatorClicks));


let btns = Array.from(document.querySelectorAll(".accordion-btn"));

const skillsAccord = () => {
	let info = Array.from(document.querySelectorAll(".accordion-item"));
	let index = btns.indexOf(event.target);
	info.forEach((card,i) => {
		if (i==index) {
			if (card.classList.contains("accordion-show")) {
				card.classList.remove("accordion-show");
				btns[i].querySelector("span").classList.remove("accordion-show");
			} else {
				card.classList.add("accordion-show");
				btns[i].querySelector("span").classList.add("accordion-show");
				let scroller = setInterval(() => {card.scrollIntoView()}, 1);
				setTimeout(() => {clearInterval(scroller)}, 10);
			}
		} else {
			card.classList.remove("accordion-show");
			btns[i].querySelector("span").classList.remove("accordion-show");
		} 
	});
}

btns.forEach(btn => btn.addEventListener("click", skillsAccord));

document.querySelectorAll(".about-close-btn").forEach(btn => btn.addEventListener("click", () => {
	if (btn.classList.contains("about-open")) {
		btn.classList.remove("about-open");
		Array.from(btn.parentElement.children[0].children).forEach(ch => ch.classList.remove("appear"));
	} else {
		btn.classList.add("about-open");
		Array.from(btn.parentElement.children[0].children).forEach(ch => ch.classList.add("appear"));
	}
	 	 
	})
);

document.querySelectorAll(".tools-btn").forEach(btn => btn.addEventListener("click", () => {
btn.parentElement.querySelector(".sample-tools").classList.add("appear");
	
}));


document.querySelectorAll(".tools-close-btn").forEach(btn => btn.addEventListener("click", () => {
btn.parentElement.classList.remove("appear");
	
}));


document.querySelector("#attr-btn").addEventListener("click", () => {
document.querySelector("#attr-modal").classList.add("attr-appear");
document.body.style.overflow = "hidden";

});
	


document.querySelector("#attr-modal button").addEventListener("click", () => {
document.querySelector("#attr-modal").classList.remove("attr-appear");
document.body.style.overflow = "initial";
	
});


const arr = {
	0: "hero1",
	1: "hero2",
	2: "hero3",
	3: "hero4"
};


/*



const scrollSpy = () => {
 let viewed = sections.filter( section => section.getBoundingClientRect().top >= 0 && section.getBoundingClientRect().top <= window.innerHeight) || 
(section.getBoundingClientRect().bottom >= 0 && section.getBoundingClientRect().bottom <= window.innerHeight) || (section.getBoundingClientRect().top <= 0 && section.getBoundingClientRect().bottom >= window.innerHeight);


if (viewed.includes(sections.at(-1)) {}
	if contact is >40% intersecting
		=> focus contact
else
	=>focus section taking up most of viewport
	(calc (via window.inner - top if > 0 - bottom if > 0 / window.inner) => choose max, then creating list that matches max-ratio, then choosing last el in this list)

}

*/

let sections = Array.from(document.querySelectorAll("section:not(:first-of-type)"));

function showCurrentNav() {
		let sectionTops = [];
		sections.forEach(section => {sectionTops.push(Math.abs(section.getBoundingClientRect().top) )} );

	
		return sectionTops.indexOf(Math.min(...sectionTops));
	}

const scrollSpy = () => {
	if (sections.at(-1).getBoundingClientRect().bottom < window.innerHeight) {Array.from(document.querySelector("#nav-scroller").children).at(-1).scrollIntoView();} else {Array.from(document.querySelector("#nav-scroller").children)[showCurrentNav()].scrollIntoView();}
}

window.addEventListener('scrollend', scrollSpy);
window.addEventListener('load', scrollSpy);
window.addEventListener('resize', scrollSpy);

document.querySelector("#copyright-year").textContent = new Date(Date.now()).getFullYear();
