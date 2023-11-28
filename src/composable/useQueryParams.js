import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";

export function useQueryParams(initialParams = {}) {
    const router = useRouter();
    const queryParams = ref(initialParams);

    const updateQueryParams = () => {
        const newParams = new URLSearchParams(router.currentRoute.value.query);
        const params = {};
        for (const [key, value] of newParams) {
            if (key == "sort") {
                params[key] = value.split(",");
            } else if (key == "search" || key == "between") {
                params[key] = JSON.parse(decodeURIComponent(value));
            } else {
                params[key] = value;
            }
        }

        queryParams.value = params;
    };

    watch(
        () => router.currentRoute.value.query,
        () => {
            updateQueryParams();
        }
    );

    const setQueryParam = (queryParams) => {
        for (const [key, value] of Object.entries(queryParams)) {
            if (typeof value === "object" && !Array.isArray(value)) {
                queryParams[key] = encodeURIComponent(JSON.stringify(value));
            } else {
                queryParams[key] = value;
            }
        }
        router.push({ query: queryParams });
    };

    onMounted(() => {
        updateQueryParams();
    });

    return { queryParams, setQueryParam };
}
