// Standardized status light animations and configurations

export const statusLightAnimations = {
    working: {
        animate: { scale: [1, 1.4, 1], opacity: [1, 0.4, 1] },
        transition: {
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut",
        }
    },
    waiting: {
        animate: { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] },
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
        }
    }
};

export const statusLightClasses = {
    done: "status-light status-light--done",
    working: "status-light status-light--working",
    waitingProduction: "status-light status-light--waiting-production",
    waitingCasting: "status-light status-light--waiting-casting",
    waitingMarketing: "status-light status-light--waiting-marketing"
};

export const statusTextClasses = {
    done: "status-text--done",
    working: "status-text--working",
    waitingProduction: "status-text--waiting",
    waitingCasting: "status-text--waiting-casting",
    waitingMarketing: "status-text--waiting-marketing"
};
