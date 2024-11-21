const body = document.body;
const html = document.documentElement;

const windowHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

const windowWidth =
  document.body.clientWidth
  || window.innerWidth
  || document.documentElement.clientWidth

export class OnboardingTour {
  constructor() {
    this.steps = [];
    this.currentStep = 0;
  }

  start() {
    if (this.steps.length > 0) {
      this.showStep(this.currentStep);
    }
  }

  createOverlay(element) {


    const overlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    overlay.setAttribute('class', 'mask');
    overlay.style.height = windowHeight;
    overlay.innerHTML = `
  <defs>
  <mask id="ant-tour-mask-:r8s:">
  <rect x="0" y="0" width="100vw" height="${windowHeight}" fill="white"></rect>
  <rect x="${element.offsetLeft - 4}" y="${element.offsetTop - 4}" rx="2" width="${element.offsetWidth + 8}" height="${element.offsetHeight + 8}" fill="black" s></rect>
  </mask>
  </defs>
    <rect x="0" y="0" width="100%" height="${windowHeight}" fill="rgba(0,0,0,0.5)" mask="url(#ant-tour-mask-:r8s:)"></rect>
    <rect fill="transparent" x="${0}" y="${0}" width="${element.offsetLeft}" height="${windowHeight}"/>
    <rect fill="transparent" x="${0}" y="${0}" width="100%" height="${element.offsetTop}"/>
    <rect fill="transparent" x="${element.offsetWidth + element.offsetLeft}" y="0" width="${windowWidth - element.offsetWidth - element.offsetLeft}" height="${windowHeight}"/>
    <rect fill="transparent" x="${0}" y="${element.offsetTop + element.offsetHeight}" width="100%" height="${windowHeight - element.offsetHeight - element.offsetTop}"/>
    `;

    document.body.appendChild(overlay);
  }

  removeOverlay() {

    const overlay = document.querySelector('.mask');
    document.body.removeChild(overlay);

  }

  calculatePopoverPosition(element) {
    const rect = element.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const position = {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft,
      width: rect.width,
      height: rect.height
    };

    return position;
  }

  position(element, popover, step) {
    let placement = step.popover.position;
    let top = 0;
    let left = 0;
    const offset = 16;

    const elementPosition = this.calculatePopoverPosition(element);
    const popoverHeight = popover.offsetHeight;
    const popoverWidth = popover.offsetWidth;
    let posiblePositions = ['top', 'bottom', 'left', 'right']

    let positionIsUnfound = true;

    while (positionIsUnfound) {
      switch (placement) {
        case 'top':
          top = elementPosition.top - popoverHeight - offset;
          left = elementPosition.left + (elementPosition.width - popoverWidth) / 2;
          if (top < 1) { // if popover is off top of screen, move it to bottom
            posiblePositions = posiblePositions.filter(pos => pos !== 'top');
            placement = posiblePositions[0];

          }
          else {
            if (left < 0) {
              left = offset;
            }
            if (left + popoverWidth >= windowWidth) {
              left = windowWidth - popoverWidth - offset;
            }
            positionIsUnfound = false;
          }
          break;

        case 'bottom':
          top = elementPosition.top + elementPosition.height + offset;
          left = elementPosition.left + (elementPosition.width - popoverWidth) / 2;
          if (top + popoverHeight + offset > windowHeight) { // if popover is off bottom of screen, move it to top
            posiblePositions = posiblePositions.filter(pos => pos !== 'bottom');
            placement = posiblePositions[0];
          }
          else {
            if (left < 0) {
              left = offset;
            }
            if (left + popoverWidth >= windowWidth) {
              left = windowWidth - popoverWidth - offset;
            }
            positionIsUnfound = false;
          }
          break;

        case 'left':
          top = elementPosition.top + (elementPosition.height - popoverHeight) / 2;
          left = elementPosition.left - popoverWidth - offset;
          if (left < 0) { // if popover is off left side of screen, move it to right
            posiblePositions = posiblePositions.filter(pos => pos !== 'left');
            placement = posiblePositions[posiblePositions.length - 1];
          }
          else {
            if (top < 0) {
              top = offset;
            }
            if (top + popoverHeight >= windowHeight) {
              top = windowHeight - popoverHeight - offset;
            }
            positionIsUnfound = false;
          }
          break;

        case 'right':
          top = elementPosition.top + (elementPosition.height - popoverHeight) / 2;
          left = elementPosition.left + elementPosition.width + offset;
          if (left + popoverWidth + offset > windowWidth) { // if popover is off right side of screen, move it to left
            posiblePositions = posiblePositions.filter(pos => pos !== 'right');
            placement = posiblePositions[posiblePositions.length - 1];
          }
          else {
            if (top < 0) {
              top = offset;
            }
            if (top + popoverHeight >= windowHeight) {
              top = windowHeight - popoverHeight - offset;
            }
            positionIsUnfound = false;
          }
          break;



        default:
          popover.style.left = `${element.offsetLeft}px`;
          popover.style.top = `${element.offsetTop + element.offsetHeight}px`;
          positionIsUnfound = false;
          break;
      }
    }

    popover.style.top = `${top}px`;
    popover.style.left = `${left}px`;

  }

  showStep(stepIndex) {

    if (stepIndex < this.steps.length) {
      const step = this.steps[stepIndex];
      let element = document.querySelector(step.element);

      // Create the overlay

      this.createOverlay(element);

      if (step.popover.block == 'enable') {
        element.classList.add('disabled');
      }
      else
        element.classList.remove('disabled');

      // Create the popover
      let popover = document.createElement('div');
      popover.className = step.popover.className;
      popover.innerHTML = `
          <div class="title">${step.popover.title}</div>
          <div class="description">${step.popover.description}</div>
          <div class="counter">${stepIndex + 1}/${this.steps.length}</div>
          <button class="prev-btn">Предыдущий</button>
          <button class="next-btn">Следующий</button>
          <button class="back-btn">Выйти</button>
        `;

      popover.style.position = 'absolute';
      popover.className = 'popover';

      document.body.appendChild(popover);
      this.position(element, popover, step);

      // Highlight the element
      element.classList.add('highlight');


      // Scroll to the element
      element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

      const prevBtn = popover.querySelector('.prev-btn');
      prevBtn.addEventListener('click', () => {
        this.removeOverlay();
        document.body.removeChild(popover);
        element.classList.remove('highlight');
        element.classList.remove('disabled');
        this.showStep(stepIndex - 1);
      });

      const nextBtn = popover.querySelector('.next-btn');
      nextBtn.addEventListener('click', () => {
        this.removeOverlay();
        document.body.removeChild(popover);
        element.classList.remove('highlight');
        element.classList.remove('disabled');
        this.showStep(stepIndex + 1);
      });

      const backBtn = popover.querySelector('.back-btn');
      backBtn.addEventListener('click', () => {
        this.removeOverlay();
        document.body.removeChild(popover);
        element.classList.remove('highlight');
        element.classList.remove('disabled');
        this.showStep(stepIndex = this.steps.length);
      });



    }
  }

  addStep(step) {
    this.steps.push(step);
  }

  StartNewTour(steps) {
    steps.forEach((step) => {
      this.addStep(step);
    });
    this.start();
  }
}

