'use client'
import axios from "axios"
import {useState, useMemo, useEffect} from 'react'


const useFetch = (url, method = "GET", options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refreshIndex, setRefreshIndex] = useState(0);

    const optionsString = JSON.stringify(options);

    const requestOptions = useMemo(() => {
        const optionsObj = { ...options };
        if (method === "POST" && !optionsObj.data) {
            optionsObj.data = {};
        }
        return optionsObj;
    }, [method, optionsString]);

    useEffect(() => {
        const apiCall = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data: response } = await axios({ url, method, ...(requestOptions) })
                if (!response.success) {
                    throw new Error(response.message)
                }
                setData(response);
            } catch (error) {
                setError(error.response)
            } finally {
                setLoading(false);
            }
        }
           apiCall();
    }, [url, refreshIndex, requestOptions])


    const refetch = () => {
        setRefreshIndex(prev => prev + 1);
    }

    return { data, loading, error, refetch };

}

export default useFetch;