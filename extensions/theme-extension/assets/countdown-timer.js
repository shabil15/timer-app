(function() {
  const { h, render, Component } = window.preact;

  class CountdownTimer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isLoading: true,
        hasEnded: false,
        error: null
      };
    }

    componentDidMount() {
      this.fetchTimerData();
    }

    fetchTimerData() {
      const shop = window.Shopify.shop;
      fetch(`${location.origin}/apps/proxy?shop=${Shopify.shop}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const endDate = new Date(data.endDateTime);
          this.setState({ endDate, isLoading: false }, () => {
            this.timerInterval = setInterval(() => this.updateCountdown(), 1000);
          });
        })
        .catch(error => {
          console.error('Error fetching timer data:', error);
          this.setState({ isLoading: false, error: 'Failed to load timer data' });
        });
    }

    updateCountdown() {
      const now = new Date();
      const timeLeft = this.state.endDate - now;

      if (timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.setState({ hasEnded: true });
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      this.setState({ days, hours, minutes, seconds });
    }

    componentWillUnmount() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
    }

    render() {
      const { days, hours, minutes, seconds, isLoading, hasEnded, error } = this.state;
      const { description, displayOptions } = this.props;

      if (isLoading) {
        return h('div', { class: 'countdown-timer-loading' }, 'Loading timer...');
      }

      if (error) {
        return h('div', { class: 'countdown-timer-error' }, error);
      }

      if (hasEnded) {
        return h('div', { class: 'countdown-timer-ended' }, 'The offer has ended!');
      }

      return h('div', { 
        class: 'countdown-timer',
        style: {
          color: displayOptions.color,
          fontSize: displayOptions.size,
          [displayOptions.position]: '0'
        }
      }, [
        h('div', { class: 'countdown-timer-description' }, description),
        h('div', { class: 'countdown-timer-digits' }, [
          h('span', null, `${days}d `),
          h('span', null, `${hours}h `),
          h('span', null, `${minutes}m `),
          h('span', null, `${seconds}s`)
        ])
      ]);
    }
  }

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    const container = document.createElement('div');
    container.id = 'countdown-timer-container';
    document.body.appendChild(container);

    render(
      h(CountdownTimer, window.countdownTimerSettings),
      container
    );
  });
})();