export const trackUmamiEvent = (eventName: any, eventGroup = "click") => {
    //@ts-ignore
    window.umami && window.umami?.trackEvent(eventName, eventGroup);
};
