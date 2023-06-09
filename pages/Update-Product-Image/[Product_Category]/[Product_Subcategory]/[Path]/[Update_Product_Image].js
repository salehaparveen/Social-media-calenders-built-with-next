import Update_Product_Image_Cmp from "../../../../../Components/Update_Product_Image";
import { parseCookies } from 'nookies';
import axios from "axios";
import Loader from '../../../../../Components/Loader';
import Router from 'next/router';
import { useState } from "react";

function Update_Product({ Image_Update_Data }) {

    const Loding = () => {
        const [loading, setLoading] = useState(true);

        Router.onRouteChangeStart = url => {
            setLoading(false);
        }
        Router.onRouteChangeComplete = url => {
            setLoading(true);
        }
        if (loading) {
            return (
                <>
                    <Update_Product_Image_Cmp Image_Update_Data={Image_Update_Data} />

                </>
            );
        } else {
            return (
                <>
                    <Loader />
                </>
            );
        }
    }



    return (
        <>
            <Loding />
        </>
    );

}

export async function getServerSideProps(ctx) {

    const cookie = parseCookies(ctx);

    if (cookie.Token) {
        if (cookie.User_Role !== "Admin") {
            const { res } = ctx
            res.writeHead(302, { Location: "/" })
            res.end()
        }
    } else {
        const { res } = ctx
        res.writeHead(302, { Location: "/Login" })
        res.end()
    }

    const { Product_Category, Product_Subcategory, Path, Update_Product_Image } = ctx.params;

    const Data = await
        axios.get(`${process.env.Api_Base_Url}/api/Product?By=Updateimg&Path=${Path}&id=${Update_Product_Image}&Category=${Product_Category}&SubCategory=${Product_Subcategory}`);

    if (Data.data.message !== "Found") {
        const { res } = ctx
        res.writeHead(302, { Location: "/" })
        res.end()
    }
    return {
        props: {
            Image_Update_Data: Data.data.Image_Update_Data
        }
    }

}

export default Update_Product;