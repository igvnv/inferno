import { render } from 'inferno';

function getChromeVersion() {
  var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);

  return raw ? parseInt(raw[2], 10) : false;
}

const version = getChromeVersion();

// Old versions of chrome does not support this test
if (version > 60 || version === false) {
  describe('transition events', () => {
    let container;

    function forceReflow() {
      return document.body.clientHeight;
    }

    beforeEach(function () {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(function () {
      render(null, container);
      container.innerHTML = '';
      document.body.removeChild(container);
    });

    const transitionStyles = {
      position: 'absolute',
      top: '16px',
      left: '16px',
      transition: 'left 1ms',
      background: 'red',
      height: '16px',
      width: '16px'
    };

    it('should call "ontransitionend" at the end of a transition', (done) => {
      let clickOccurred = null;
      let handlerFired = null;

      render(
        <div
          style={transitionStyles}
          onclick={(e) => {
            e.target.style.left = '50px';
            clickOccurred = true;
            forceReflow();
          }}
          ontransitionend={(e) => {
            handlerFired = true;
            forceReflow();
          }}
        />,
        container
      );

      forceReflow();

      const div = container.firstChild;


      setTimeout(() => {
        div.click();

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            expect(clickOccurred).toBe(true);
            expect(handlerFired).toBe(true);
            done();
          });
        });
      }, 25);
    });

    it('should call "onTransitionEnd" at the end of a transition', (done) => {
      let clickOccurred = null;
      let handlerFired = null;

      render(
        <div
          style={transitionStyles}
          onclick={(e) => {
            e.target.style.left = '100px';
            clickOccurred = true;
            forceReflow();

          }}
          onTransitionEnd={(e) => {
            handlerFired = true;
            forceReflow();
          }}
        />,
        container
      );
      forceReflow();
      const div = container.firstChild;
      setTimeout(() => {
        div.click();

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            expect(clickOccurred).toBe(true);
            expect(handlerFired).toBe(true);
            done();
          });
        });
      }, 25);
    });
  });
}
