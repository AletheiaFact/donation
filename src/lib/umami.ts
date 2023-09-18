export const trackUmamiEvent = (eventName, eventGroup = "click") => {
    //@ts-ignore
    window.umami && window.umami?.trackEvent(eventName, eventGroup);
};
