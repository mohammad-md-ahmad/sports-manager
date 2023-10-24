import { useToast } from "react-native-toast-notifications";

class ToastHelper {
    private static toast: any; // The type of 'toast' may need adjustment based on the library's types

    private static toastOptions = {
        type: 'success', // "normal | success | warning | danger | custom",
        placement: 'top', // "top | bottom",
        duration: 2000, // 2 seconds
        offset: 30,
        animationType: "slide-in", // "slide-in | zoom-in",
    };

    static initialize() {
        ToastHelper.toast = useToast();
    }

    static successToast(message: string) {
        if (message) {
            ToastHelper.toast.show(message, {
                ...ToastHelper.toastOptions,
                type: 'success',
            });
        }
    }

    static warningToast(message: string) {
        if (message) {
            ToastHelper.toast.show(message, {
                ...ToastHelper.toastOptions,
                type: 'warning',
            });
        }
    }

    static errorToast(message: string) {
        if (message) {
            ToastHelper.toast.show(message, {
                ...ToastHelper.toastOptions,
                type: 'danger',
            });
        }
    }
}

export default ToastHelper;
