import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { createReadStream, promises } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { isDeepStrictEqual } from "node:util";
import { createDriveThumbnailHandler } from "./drive-thumbnail.mjs";
import { CodeChallengeMethod, OAuth2Client } from "google-auth-library";
//#region src/pages/sandbox/brand-asset-portal/catalog-types.ts
var defaultProducts = [
	"LegalOn",
	"GovernOn",
	"WorkOn",
	"DealOn",
	"LearningOn",
	"DocumentOn",
	"TrustOn",
	"On Technologies",
	"Shared"
].map((id, order) => ({
	id,
	label: id === "Shared" ? "全社共通" : id,
	state: "active",
	order
}));
function isPublished(asset, products) {
	return asset.publication !== "draft" && asset.status !== "archived" && products.some((p) => p.id === asset.brand && p.state === "active") && (!asset.expiresAt || asset.expiresAt >= (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
}
//#endregion
//#region src/pages/sandbox/brand-asset-portal/drive-file.ts
function getDriveFileId(link) {
	if (!link) return "";
	try {
		const url = new URL(link.trim());
		if (url.protocol !== "https:" || url.hostname !== "drive.google.com" || url.port || url.username || url.password) return "";
		const pathId = url.pathname.match(/^\/file\/d\/([\w-]+)(?:\/|$)/)?.[1];
		const queryId = /^\/(open|uc)$/.test(url.pathname) ? url.searchParams.get("id") : null;
		const id = pathId || queryId || "";
		return /^[\w-]+$/.test(id) ? id : "";
	} catch {
		return "";
	}
}
function getDriveDownloadLink(id) {
	return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`;
}
//#endregion
//#region src/pages/sandbox/brand-asset-portal/asset-popularity.json
var asset_popularity_default = {
	"legalon-logo-horizontal-black-png": 128,
	"legalon-presentation-template-ppt": 116,
	"governon-logo-primary-png": 104,
	"governon-presentation-template-ppt": 98,
	"workon-logo-primary-color-png": 112,
	"workon-presentation-template-ppt": 101,
	"dealon-logo-primary-color-png": 95,
	"dealon-presentation-template-ppt": 88,
	"cxon-presentation-template-ppt": 93,
	"legalon-professionalai-logo-01-black-png": 84,
	"workon-professionalai-logo-01-black-png": 79,
	"dealon-professionalai-logo-01-black-png": 76,
	"cxon-logo-primary-png": 82,
	"professionalai-logo-cxon-01-black-png": 74,
	"professionalai-logo-cxon-04-black-png": 71
};
//#endregion
//#region src/pages/sandbox/brand-asset-portal/known-asset-families.ts
var globalMapFamily = {
	id: "global-map-202610-v1-1",
	title: "Global Map"
};
var globalMapFiles = {
	"14XR2usJdmPEQUcNVySFyiP6FMeMWxwU8": "PNG",
	"1HqgEQBCfFBTjuBQvlb4PTV72y4uY119E": "AI"
};
function getKnownAssetFamily(asset) {
	return asset.driveId && globalMapFiles[asset.driveId] === asset.fileFormat ? globalMapFamily : null;
}
//#endregion
//#region src/pages/sandbox/brand-asset-portal/local-mirror-manifest.json
var local_mirror_manifest_default = {
	"legalon-logo-horizontal-black-png": {
		"mirrored": false,
		"sourceDriveId": "1Gaye2RQTUw1tZe7NQwFzEIS983p-k7ZC",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-logo-horizontal-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-logo-horizontal-black-png.png",
		"fileName": "legalon-logo-horizontal-black-png.png",
		"fileFormat": "PNG"
	},
	"legalon-logo-horizontal-black-svg": {
		"mirrored": false,
		"sourceDriveId": "1bvrb0gwyjBG78wTqwcAyPA3TLuF7bDfp",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-logo-horizontal-black-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-logo-horizontal-black-svg.svg",
		"fileName": "legalon-logo-horizontal-black-svg.svg",
		"fileFormat": "SVG"
	},
	"legalon-logo-horizontal-white-png": {
		"mirrored": false,
		"sourceDriveId": "1G6nNI1Tgalweo6Ba6FemcV-oqOlokicF",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-logo-horizontal-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-logo-horizontal-white-png.png",
		"fileName": "legalon-logo-horizontal-white-png.png",
		"fileFormat": "PNG"
	},
	"legalon-logo-horizontal-white-svg": {
		"mirrored": false,
		"sourceDriveId": "1KfKiNILEoQgvfuGdhv3HOZVsk6WJaKCX",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-logo-horizontal-white-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-logo-horizontal-white-svg.svg",
		"fileName": "legalon-logo-horizontal-white-svg.svg",
		"fileFormat": "SVG"
	},
	"legalon-professionalai-logo-01-black-ai": {
		"mirrored": false,
		"sourceDriveId": "1B5c8Um9KlyxemBEbUjPaU35FKkAMd-dk",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-01-black-ai.ai",
		"thumbnailPath": "",
		"fileName": "legalon-professionalai-logo-01-black-ai.ai",
		"fileFormat": "AI"
	},
	"legalon-professionalai-logo-01-white-ai": {
		"mirrored": false,
		"sourceDriveId": "1ulxUdV8hJjmBUBdirtTS2R0Uvk-9fvAE",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-01-white-ai.ai",
		"thumbnailPath": "",
		"fileName": "legalon-professionalai-logo-01-white-ai.ai",
		"fileFormat": "AI"
	},
	"legalon-professionalai-logo-01-black-png": {
		"mirrored": false,
		"sourceDriveId": "12tVcF-sYWtcTVvCenPNdQcCXjDaxtE-6",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-01-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-01-black-png.png",
		"fileName": "legalon-professionalai-logo-01-black-png.png",
		"fileFormat": "PNG"
	},
	"legalon-professionalai-logo-01-white-png": {
		"mirrored": false,
		"sourceDriveId": "17SgMEzk6N1Dl51Iy7xnNmxaYNTKmhVc_",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-01-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-01-white-png.png",
		"fileName": "legalon-professionalai-logo-01-white-png.png",
		"fileFormat": "PNG"
	},
	"legalon-professionalai-logo-02-black-ai": {
		"mirrored": false,
		"sourceDriveId": "1qycZngxUS8eTPl1h7PnSbbv5XWEFs7hZ",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-02-black-ai.ai",
		"thumbnailPath": "",
		"fileName": "legalon-professionalai-logo-02-black-ai.ai",
		"fileFormat": "AI"
	},
	"legalon-professionalai-logo-02-white-ai": {
		"mirrored": false,
		"sourceDriveId": "1y0slTvbIxfoQwLkJajWk21c6edTMaTU5",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-02-white-ai.ai",
		"thumbnailPath": "",
		"fileName": "legalon-professionalai-logo-02-white-ai.ai",
		"fileFormat": "AI"
	},
	"legalon-professionalai-logo-02-black-png": {
		"mirrored": false,
		"sourceDriveId": "1N08DOTrl1elONnCYz3aycDvQGtvGEuKA",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-02-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-02-black-png.png",
		"fileName": "legalon-professionalai-logo-02-black-png.png",
		"fileFormat": "PNG"
	},
	"legalon-professionalai-logo-02-white-png": {
		"mirrored": false,
		"sourceDriveId": "1BjnHd6kiQCj1ZNKrksShHzCIpZ-D7szw",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-02-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-02-white-png.png",
		"fileName": "legalon-professionalai-logo-02-white-png.png",
		"fileFormat": "PNG"
	},
	"legalon-professionalai-logo-03-black-ai": {
		"mirrored": false,
		"sourceDriveId": "1Q2gopa_XfvSGwJjzx-E7X7Nz_ucLjMQ2",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-03-black-ai.ai",
		"thumbnailPath": "",
		"fileName": "legalon-professionalai-logo-03-black-ai.ai",
		"fileFormat": "AI"
	},
	"legalon-professionalai-logo-03-white-ai": {
		"mirrored": false,
		"sourceDriveId": "1B-y9v7YJogrqLcmM9fWcF1I85zdIlM8a",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-03-white-ai.ai",
		"thumbnailPath": "",
		"fileName": "legalon-professionalai-logo-03-white-ai.ai",
		"fileFormat": "AI"
	},
	"legalon-professionalai-logo-03-black-png": {
		"mirrored": false,
		"sourceDriveId": "1W5_qUI-qQrp5nBz1igcLkvHzM-56CTdq",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-03-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-03-black-png.png",
		"fileName": "legalon-professionalai-logo-03-black-png.png",
		"fileFormat": "PNG"
	},
	"legalon-professionalai-logo-03-white-png": {
		"mirrored": false,
		"sourceDriveId": "1BoQnwFv8AdHx2YdfuSMa1bBTIZHpD-X0",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-03-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-03-white-png.png",
		"fileName": "legalon-professionalai-logo-03-white-png.png",
		"fileFormat": "PNG"
	},
	"legalon-professionalai-logo-04-black-ai": {
		"mirrored": false,
		"sourceDriveId": "1bad4yJvhgPJ_utNDudqj9UOiV-q6L27w",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-04-black-ai.ai",
		"thumbnailPath": "",
		"fileName": "legalon-professionalai-logo-04-black-ai.ai",
		"fileFormat": "AI"
	},
	"legalon-professionalai-logo-04-white-ai": {
		"mirrored": false,
		"sourceDriveId": "1HZSLcLFKXYrrmgeFD6yAXai4LYf98N5s",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-04-white-ai.ai",
		"thumbnailPath": "",
		"fileName": "legalon-professionalai-logo-04-white-ai.ai",
		"fileFormat": "AI"
	},
	"legalon-professionalai-logo-04-black-png": {
		"mirrored": false,
		"sourceDriveId": "1ac7y-fmZt6crSgu6KNi8QImafH5u_l9K",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-04-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-04-black-png.png",
		"fileName": "legalon-professionalai-logo-04-black-png.png",
		"fileFormat": "PNG"
	},
	"legalon-professionalai-logo-04-white-png": {
		"mirrored": false,
		"sourceDriveId": "11cEpcv585teAXtkM-wXCQAAKlNCulVaL",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-04-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-professionalai-logo-04-white-png.png",
		"fileName": "legalon-professionalai-logo-04-white-png.png",
		"fileFormat": "PNG"
	},
	"legalon-logo-horizontal-black-v1-png": {
		"mirrored": false,
		"sourceDriveId": "1QbJ8JJ4aMbFxHinpF6f5Yyuly4uo7XVg",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-logo-horizontal-black-v1-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-logo-horizontal-black-v1-png.png",
		"fileName": "legalon-logo-horizontal-black-v1-png.png",
		"fileFormat": "PNG"
	},
	"legalon-presentation-template-ppt": {
		"mirrored": false,
		"sourceDriveId": "1fLx5Q6x-2mqNKrazPtgIv7S2L9EeEcNP",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-presentation-template-ppt.ppt",
		"thumbnailPath": "",
		"fileName": "legalon-presentation-template-ppt.ppt",
		"fileFormat": "PPT"
	},
	"governon-presentation-template-ppt": {
		"mirrored": false,
		"sourceDriveId": "1ljlEaFQN1s1SbqZaoDwMPtJSW49hqjC4",
		"downloadPath": "brand-asset-portal-media/downloads/governon-presentation-template-ppt.ppt",
		"thumbnailPath": "",
		"fileName": "governon-presentation-template-ppt.ppt",
		"fileFormat": "PPT"
	},
	"workon-presentation-template-ppt": {
		"mirrored": false,
		"sourceDriveId": "11KLR5hrpC6viSTtFi_bUmxgL7UoniaCu",
		"downloadPath": "brand-asset-portal-media/downloads/workon-presentation-template-ppt.ppt",
		"thumbnailPath": "",
		"fileName": "workon-presentation-template-ppt.ppt",
		"fileFormat": "PPT"
	},
	"dealon-presentation-template-ppt": {
		"mirrored": false,
		"sourceDriveId": "1zIBUTllNz0iZBbnYsls6SZ6nHJBtroUS",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-presentation-template-ppt.ppt",
		"thumbnailPath": "",
		"fileName": "dealon-presentation-template-ppt.ppt",
		"fileFormat": "PPT"
	},
	"cxon-presentation-template-ppt": {
		"mirrored": false,
		"sourceDriveId": "1LU26R6liH8h-Hz0uICeBhU5ILo3poCdA",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-presentation-template-ppt.ppt",
		"thumbnailPath": "",
		"fileName": "cxon-presentation-template-ppt.ppt",
		"fileFormat": "PPT"
	},
	"workon-logo-primary-ai": {
		"mirrored": false,
		"sourceDriveId": "10GqYluADhJ7dZMBQR_RQtT4JY5GNHTk0",
		"downloadPath": "brand-asset-portal-media/downloads/workon-logo-primary-ai.ai",
		"thumbnailPath": "",
		"fileName": "workon-logo-primary-ai.ai",
		"fileFormat": "AI"
	},
	"workon-logo-primary-color-png": {
		"mirrored": false,
		"sourceDriveId": "1PlHYleoA7Q27OlrbiY9uVla-a2SJvNTu",
		"downloadPath": "brand-asset-portal-media/downloads/workon-logo-primary-color-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-logo-primary-color-png.png",
		"fileName": "workon-logo-primary-color-png.png",
		"fileFormat": "PNG"
	},
	"workon-logo-primary-black-png": {
		"mirrored": false,
		"sourceDriveId": "1zKj5mN-0wIlecKkskxRpczQ9pS169B7v",
		"downloadPath": "brand-asset-portal-media/downloads/workon-logo-primary-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-logo-primary-black-png.png",
		"fileName": "workon-logo-primary-black-png.png",
		"fileFormat": "PNG"
	},
	"workon-logo-primary-white-png": {
		"mirrored": false,
		"sourceDriveId": "1WZr633pqm0Iu4_FJR9j8q8fX4rQguJI8",
		"downloadPath": "brand-asset-portal-media/downloads/workon-logo-primary-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-logo-primary-white-png.png",
		"fileName": "workon-logo-primary-white-png.png",
		"fileFormat": "PNG"
	},
	"workon-logo-primary-color-jpg": {
		"mirrored": false,
		"sourceDriveId": "1n9IfpiIh6XAu3gGC73J7PbFVpdyek6kg",
		"downloadPath": "brand-asset-portal-media/downloads/workon-logo-primary-color-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-logo-primary-color-jpg.jpg",
		"fileName": "workon-logo-primary-color-jpg.jpg",
		"fileFormat": "JPG"
	},
	"workon-logo-primary-black-jpg": {
		"mirrored": false,
		"sourceDriveId": "1XpSCLhcRyHU4AiqPVXFfVDN8JBDtZAoK",
		"downloadPath": "brand-asset-portal-media/downloads/workon-logo-primary-black-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-logo-primary-black-jpg.jpg",
		"fileName": "workon-logo-primary-black-jpg.jpg",
		"fileFormat": "JPG"
	},
	"workon-logo-primary-white-light-jpg": {
		"mirrored": false,
		"sourceDriveId": "1XLroKYXPGxYfS4I_ICtvt_Nz6C2-Vw7W",
		"downloadPath": "brand-asset-portal-media/downloads/workon-logo-primary-white-light-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-logo-primary-white-light-jpg.jpg",
		"fileName": "workon-logo-primary-white-light-jpg.jpg",
		"fileFormat": "JPG"
	},
	"workon-logo-primary-white-dark-jpg": {
		"mirrored": false,
		"sourceDriveId": "1-wae0eq2dFIUMeZa7HX_bQgmOraDRnLm",
		"downloadPath": "brand-asset-portal-media/downloads/workon-logo-primary-white-dark-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-logo-primary-white-dark-jpg.jpg",
		"fileName": "workon-logo-primary-white-dark-jpg.jpg",
		"fileFormat": "JPG"
	},
	"workon-brand-guidelines-pdf": {
		"mirrored": false,
		"sourceDriveId": "1MZk7t70TduO4fN63DyZejmB7OQt6T0Nr",
		"downloadPath": "brand-asset-portal-media/downloads/workon-brand-guidelines-pdf.pdf",
		"thumbnailPath": "",
		"fileName": "workon-brand-guidelines-pdf.pdf",
		"fileFormat": "PDF"
	},
	"workon-professionalai-logo-01-black-ai": {
		"mirrored": false,
		"sourceDriveId": "1nYlEIb0oF0VWsFtEMPGjGiahc1bl93d0",
		"downloadPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-01-black-ai.ai",
		"thumbnailPath": "",
		"fileName": "workon-professionalai-logo-01-black-ai.ai",
		"fileFormat": "AI"
	},
	"workon-professionalai-logo-01-white-ai": {
		"mirrored": false,
		"sourceDriveId": "1aiDVLFIwiMXdNnXLPjHIFaNiJRM8ZK_C",
		"downloadPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-01-white-ai.ai",
		"thumbnailPath": "",
		"fileName": "workon-professionalai-logo-01-white-ai.ai",
		"fileFormat": "AI"
	},
	"workon-professionalai-logo-01-black-png": {
		"mirrored": false,
		"sourceDriveId": "1O-s8kIiiBQpe7kuceqVu9923VlswHDxv",
		"downloadPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-01-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-01-black-png.png",
		"fileName": "workon-professionalai-logo-01-black-png.png",
		"fileFormat": "PNG"
	},
	"workon-professionalai-logo-01-white-png": {
		"mirrored": false,
		"sourceDriveId": "1KIDVUsfe2yWryzXTas_4iHoSxj4zSuQ0",
		"downloadPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-01-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-01-white-png.png",
		"fileName": "workon-professionalai-logo-01-white-png.png",
		"fileFormat": "PNG"
	},
	"workon-professionalai-logo-02-black-ai": {
		"mirrored": false,
		"sourceDriveId": "16B_i6mpg7j_Lgu0ljmMYlgZNYiUv8rP3",
		"downloadPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-02-black-ai.ai",
		"thumbnailPath": "",
		"fileName": "workon-professionalai-logo-02-black-ai.ai",
		"fileFormat": "AI"
	},
	"workon-professionalai-logo-02-white-ai": {
		"mirrored": false,
		"sourceDriveId": "1OHTZ_dxSCra5HeMnJkUH9ISQm3QkG2Kn",
		"downloadPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-02-white-ai.ai",
		"thumbnailPath": "",
		"fileName": "workon-professionalai-logo-02-white-ai.ai",
		"fileFormat": "AI"
	},
	"workon-professionalai-logo-02-black-png": {
		"mirrored": false,
		"sourceDriveId": "1OCeDGv5HeFy-rX9KJAxPYvO9vSFZFrOs",
		"downloadPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-02-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-02-black-png.png",
		"fileName": "workon-professionalai-logo-02-black-png.png",
		"fileFormat": "PNG"
	},
	"workon-professionalai-logo-02-white-png": {
		"mirrored": false,
		"sourceDriveId": "1o5Vqlk5UmkashuxOdfBsSr635sBy72cR",
		"downloadPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-02-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-02-white-png.png",
		"fileName": "workon-professionalai-logo-02-white-png.png",
		"fileFormat": "PNG"
	},
	"workon-professionalai-logo-03-black-ai": {
		"mirrored": false,
		"sourceDriveId": "1wWqYc377kkhB9kWkUx_Z5QwKDW5kf4TG",
		"downloadPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-03-black-ai.ai",
		"thumbnailPath": "",
		"fileName": "workon-professionalai-logo-03-black-ai.ai",
		"fileFormat": "AI"
	},
	"workon-professionalai-logo-03-white-ai": {
		"mirrored": false,
		"sourceDriveId": "1LybrxV1pj88l6CGYv7CoeoNdh5BEi6XY",
		"downloadPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-03-white-ai.ai",
		"thumbnailPath": "",
		"fileName": "workon-professionalai-logo-03-white-ai.ai",
		"fileFormat": "AI"
	},
	"workon-professionalai-logo-03-black-png": {
		"mirrored": false,
		"sourceDriveId": "1M5Xo1GZcgbDEz971gjqcooDPqVS3M82a",
		"downloadPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-03-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-03-black-png.png",
		"fileName": "workon-professionalai-logo-03-black-png.png",
		"fileFormat": "PNG"
	},
	"workon-professionalai-logo-03-white-png": {
		"mirrored": false,
		"sourceDriveId": "1WbViAMBQdwblUUP_2Pf6PKr6N69TZbP-",
		"downloadPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-03-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-03-white-png.png",
		"fileName": "workon-professionalai-logo-03-white-png.png",
		"fileFormat": "PNG"
	},
	"workon-professionalai-logo-04-black-ai": {
		"mirrored": false,
		"sourceDriveId": "1G0Gkuk_qf2yQCiZdFI7_8skAJkvMS28-",
		"downloadPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-04-black-ai.ai",
		"thumbnailPath": "",
		"fileName": "workon-professionalai-logo-04-black-ai.ai",
		"fileFormat": "AI"
	},
	"workon-professionalai-logo-04-white-ai": {
		"mirrored": false,
		"sourceDriveId": "1yuNPRP-3fkw0liODKBoxCUNNvi2IVaVl",
		"downloadPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-04-white-ai.ai",
		"thumbnailPath": "",
		"fileName": "workon-professionalai-logo-04-white-ai.ai",
		"fileFormat": "AI"
	},
	"workon-professionalai-logo-04-black-png": {
		"mirrored": false,
		"sourceDriveId": "1YK6BcBm2JIGxxl1_EGI0R4inqnr54eKh",
		"downloadPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-04-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-04-black-png.png",
		"fileName": "workon-professionalai-logo-04-black-png.png",
		"fileFormat": "PNG"
	},
	"workon-professionalai-logo-04-white-png": {
		"mirrored": false,
		"sourceDriveId": "1ppCXhKxrpc0boqY7NFjK-vCGkMpUyA1F",
		"downloadPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-04-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-professionalai-logo-04-white-png.png",
		"fileName": "workon-professionalai-logo-04-white-png.png",
		"fileFormat": "PNG"
	},
	"dealon-logo-primary-ai": {
		"mirrored": false,
		"sourceDriveId": "1okXeEOo3UJSXsTwc2tOLWlUrj1Lrkgdi",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-logo-primary-ai.ai",
		"thumbnailPath": "",
		"fileName": "dealon-logo-primary-ai.ai",
		"fileFormat": "AI"
	},
	"dealon-logo-primary-color-png": {
		"mirrored": false,
		"sourceDriveId": "1fD7fQXkd7BlVdak-az9aKFGh1ieb7I8z",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-logo-primary-color-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-logo-primary-color-png.png",
		"fileName": "dealon-logo-primary-color-png.png",
		"fileFormat": "PNG"
	},
	"dealon-logo-primary-black-png": {
		"mirrored": false,
		"sourceDriveId": "1uoajx3s5s9auvNXgq1Ka6hsOOnXdw12d",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-logo-primary-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-logo-primary-black-png.png",
		"fileName": "dealon-logo-primary-black-png.png",
		"fileFormat": "PNG"
	},
	"dealon-logo-primary-white-png": {
		"mirrored": false,
		"sourceDriveId": "1AIUBIryX4JLdYdCZ5LQyLGlEJdrBMAqO",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-logo-primary-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-logo-primary-white-png.png",
		"fileName": "dealon-logo-primary-white-png.png",
		"fileFormat": "PNG"
	},
	"dealon-logo-primary-color-jpg": {
		"mirrored": false,
		"sourceDriveId": "1U_AR4NLdVCUx_Cs-65MQQb-G2_3MD7Jl",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-logo-primary-color-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-logo-primary-color-jpg.jpg",
		"fileName": "dealon-logo-primary-color-jpg.jpg",
		"fileFormat": "JPG"
	},
	"dealon-logo-primary-black-jpg": {
		"mirrored": false,
		"sourceDriveId": "1gzr1A-mcFttBJXtv4J-TvPSa4GHI0RNS",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-logo-primary-black-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-logo-primary-black-jpg.jpg",
		"fileName": "dealon-logo-primary-black-jpg.jpg",
		"fileFormat": "JPG"
	},
	"dealon-logo-primary-white-light-jpg": {
		"mirrored": false,
		"sourceDriveId": "1NrzQY3FAsy-V_jPW-UXK3nd9iqVK0Rd3",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-logo-primary-white-light-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-logo-primary-white-light-jpg.jpg",
		"fileName": "dealon-logo-primary-white-light-jpg.jpg",
		"fileFormat": "JPG"
	},
	"dealon-logo-primary-white-dark-jpg": {
		"mirrored": false,
		"sourceDriveId": "1HS0rayMSMKXe5ShKhs-8R9acFTl8qjPP",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-logo-primary-white-dark-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-logo-primary-white-dark-jpg.jpg",
		"fileName": "dealon-logo-primary-white-dark-jpg.jpg",
		"fileFormat": "JPG"
	},
	"dealon-professionalai-logo-01-black-ai": {
		"mirrored": false,
		"sourceDriveId": "1YZSC0NpcRmyDpVTN1HlgRM2w0KjCaenN",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-01-black-ai.ai",
		"thumbnailPath": "",
		"fileName": "dealon-professionalai-logo-01-black-ai.ai",
		"fileFormat": "AI"
	},
	"dealon-professionalai-logo-01-white-ai": {
		"mirrored": false,
		"sourceDriveId": "183b-dHXFC-_Ft1gZJCQa98jkXlWqFLbB",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-01-white-ai.ai",
		"thumbnailPath": "",
		"fileName": "dealon-professionalai-logo-01-white-ai.ai",
		"fileFormat": "AI"
	},
	"dealon-professionalai-logo-01-black-png": {
		"mirrored": false,
		"sourceDriveId": "1pyQyI2N6ucELYDIBpjm14g0FQ8gy7bT7",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-01-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-01-black-png.png",
		"fileName": "dealon-professionalai-logo-01-black-png.png",
		"fileFormat": "PNG"
	},
	"dealon-professionalai-logo-01-white-png": {
		"mirrored": false,
		"sourceDriveId": "1PjUbiWgpfroLSZyvl73z3meFB0QtuFD8",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-01-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-01-white-png.png",
		"fileName": "dealon-professionalai-logo-01-white-png.png",
		"fileFormat": "PNG"
	},
	"dealon-professionalai-logo-02-black-ai": {
		"mirrored": false,
		"sourceDriveId": "1RDUNT6yltnPnJlM5z-76K3eq4prPt54q",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-02-black-ai.ai",
		"thumbnailPath": "",
		"fileName": "dealon-professionalai-logo-02-black-ai.ai",
		"fileFormat": "AI"
	},
	"dealon-professionalai-logo-02-white-ai": {
		"mirrored": false,
		"sourceDriveId": "1odvZKDtbFnkojPHoqoOc2mnrM2lVQoWV",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-02-white-ai.ai",
		"thumbnailPath": "",
		"fileName": "dealon-professionalai-logo-02-white-ai.ai",
		"fileFormat": "AI"
	},
	"dealon-professionalai-logo-02-black-png": {
		"mirrored": false,
		"sourceDriveId": "1DHaid4T87aQgdvR_NZbnJvEuYofC4Xqo",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-02-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-02-black-png.png",
		"fileName": "dealon-professionalai-logo-02-black-png.png",
		"fileFormat": "PNG"
	},
	"dealon-professionalai-logo-02-white-png": {
		"mirrored": false,
		"sourceDriveId": "1CoBUyFmvZgNeTVVWgCHFvzdwUtYixcDZ",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-02-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-02-white-png.png",
		"fileName": "dealon-professionalai-logo-02-white-png.png",
		"fileFormat": "PNG"
	},
	"dealon-professionalai-logo-03-black-ai": {
		"mirrored": false,
		"sourceDriveId": "1h1VbXwZPGmTOtkge_nLsgYOI1jL8Kues",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-03-black-ai.ai",
		"thumbnailPath": "",
		"fileName": "dealon-professionalai-logo-03-black-ai.ai",
		"fileFormat": "AI"
	},
	"dealon-professionalai-logo-03-white-ai": {
		"mirrored": false,
		"sourceDriveId": "1ATuoLhsFLVL9Drnbqz2a6sQ60Al4p3e5",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-03-white-ai.ai",
		"thumbnailPath": "",
		"fileName": "dealon-professionalai-logo-03-white-ai.ai",
		"fileFormat": "AI"
	},
	"dealon-professionalai-logo-03-black-png": {
		"mirrored": false,
		"sourceDriveId": "1-qtQ4dqNzwSCIk8zT_4MjJFN__GLcNKG",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-03-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-03-black-png.png",
		"fileName": "dealon-professionalai-logo-03-black-png.png",
		"fileFormat": "PNG"
	},
	"dealon-professionalai-logo-03-white-png": {
		"mirrored": false,
		"sourceDriveId": "1geVBE-s-MThP64navCLcwzEgi-NpC4LO",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-03-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-03-white-png.png",
		"fileName": "dealon-professionalai-logo-03-white-png.png",
		"fileFormat": "PNG"
	},
	"dealon-professionalai-logo-04-black-ai": {
		"mirrored": false,
		"sourceDriveId": "1HAUimGtDVxEWB99PBuHkbQTmGnl6mSJM",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-04-black-ai.ai",
		"thumbnailPath": "",
		"fileName": "dealon-professionalai-logo-04-black-ai.ai",
		"fileFormat": "AI"
	},
	"dealon-professionalai-logo-04-white-ai": {
		"mirrored": false,
		"sourceDriveId": "1pttWiDSD-0QguW7pV8d5ikgBpph6XydM",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-04-white-ai.ai",
		"thumbnailPath": "",
		"fileName": "dealon-professionalai-logo-04-white-ai.ai",
		"fileFormat": "AI"
	},
	"dealon-professionalai-logo-04-black-png": {
		"mirrored": false,
		"sourceDriveId": "1pRxkMlDktwyzdbi1UTEVxFKbKVE4BEQF",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-04-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-04-black-png.png",
		"fileName": "dealon-professionalai-logo-04-black-png.png",
		"fileFormat": "PNG"
	},
	"dealon-professionalai-logo-04-white-png": {
		"mirrored": false,
		"sourceDriveId": "1ZTxC2HmvW3P-57PXl3SYas5Ls6FjjGSh",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-04-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-professionalai-logo-04-white-png.png",
		"fileName": "dealon-professionalai-logo-04-white-png.png",
		"fileFormat": "PNG"
	},
	"dealon-brand-guidelines-pdf": {
		"mirrored": false,
		"sourceDriveId": "1E88n0rdWTQYKYHFg4ioWq9X1lcFYquHx",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-brand-guidelines-pdf.pdf",
		"thumbnailPath": "",
		"fileName": "dealon-brand-guidelines-pdf.pdf",
		"fileFormat": "PDF"
	},
	"governon-logo-primary-svg": {
		"mirrored": false,
		"sourceDriveId": "1BWR76eBIoD8Pi47qko9ymTUDDQ2GDZSa",
		"downloadPath": "brand-asset-portal-media/downloads/governon-logo-primary-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-logo-primary-svg.svg",
		"fileName": "governon-logo-primary-svg.svg",
		"fileFormat": "SVG"
	},
	"governon-logo-primary-black-svg": {
		"mirrored": false,
		"sourceDriveId": "1CquJqqkNw6kTgNp47YBzydVtYXqRs6bP",
		"downloadPath": "brand-asset-portal-media/downloads/governon-logo-primary-black-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-logo-primary-black-svg.svg",
		"fileName": "governon-logo-primary-black-svg.svg",
		"fileFormat": "SVG"
	},
	"governon-logo-primary-white-svg": {
		"mirrored": false,
		"sourceDriveId": "1JeD_N_e83UbRelD8VmAmq6KGXtAFcKA_",
		"downloadPath": "brand-asset-portal-media/downloads/governon-logo-primary-white-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-logo-primary-white-svg.svg",
		"fileName": "governon-logo-primary-white-svg.svg",
		"fileFormat": "SVG"
	},
	"governon-logo-primary-png": {
		"mirrored": false,
		"sourceDriveId": "1asqZRJuoShTAlU7zT6RinA4TUDKxsQIM",
		"downloadPath": "brand-asset-portal-media/downloads/governon-logo-primary-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-logo-primary-png.png",
		"fileName": "governon-logo-primary-png.png",
		"fileFormat": "PNG"
	},
	"governon-logo-primary-black-png": {
		"mirrored": false,
		"sourceDriveId": "1fI-S1awrkbR-jGiv53Bj1vgPQvJAfCx6",
		"downloadPath": "brand-asset-portal-media/downloads/governon-logo-primary-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-logo-primary-black-png.png",
		"fileName": "governon-logo-primary-black-png.png",
		"fileFormat": "PNG"
	},
	"governon-logo-primary-white-png": {
		"mirrored": false,
		"sourceDriveId": "1Khjy947B8muHzRYKdNNJ4JS8MtpR83Jd",
		"downloadPath": "brand-asset-portal-media/downloads/governon-logo-primary-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-logo-primary-white-png.png",
		"fileName": "governon-logo-primary-white-png.png",
		"fileFormat": "PNG"
	},
	"governon-logo-primary-color-jpg": {
		"mirrored": false,
		"sourceDriveId": "1o8cX_ddhMyosfPU0lhn-j5yUQyv7FW6l",
		"downloadPath": "brand-asset-portal-media/downloads/governon-logo-primary-color-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-logo-primary-color-jpg.jpg",
		"fileName": "governon-logo-primary-color-jpg.jpg",
		"fileFormat": "JPG"
	},
	"governon-logo-primary-black-jpg": {
		"mirrored": false,
		"sourceDriveId": "1evRHP0P7pjcy71258RE6Zl0Ewpp5EER-",
		"downloadPath": "brand-asset-portal-media/downloads/governon-logo-primary-black-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-logo-primary-black-jpg.jpg",
		"fileName": "governon-logo-primary-black-jpg.jpg",
		"fileFormat": "JPG"
	},
	"governon-logo-primary-white-jpg": {
		"mirrored": false,
		"sourceDriveId": "1IMRXe8A45DgUYZ-cKaLqTQs8Y_7env49",
		"downloadPath": "brand-asset-portal-media/downloads/governon-logo-primary-white-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-logo-primary-white-jpg.jpg",
		"fileName": "governon-logo-primary-white-jpg.jpg",
		"fileFormat": "JPG"
	},
	"governon-logo-primary-ai": {
		"mirrored": false,
		"sourceDriveId": "1pknB0w1YiUmpSs4Z40wfveJ-2nz8THoH",
		"downloadPath": "brand-asset-portal-media/downloads/governon-logo-primary-ai.ai",
		"thumbnailPath": "",
		"fileName": "governon-logo-primary-ai.ai",
		"fileFormat": "AI"
	},
	"governon-professionalai-logo-01-black-ai": {
		"mirrored": false,
		"sourceDriveId": "1dIbBwFKpe_QUi7hSX3-2_UWxKZ6QJOBk",
		"downloadPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-01-black-ai.ai",
		"thumbnailPath": "",
		"fileName": "governon-professionalai-logo-01-black-ai.ai",
		"fileFormat": "AI"
	},
	"governon-professionalai-logo-01-white-ai": {
		"mirrored": false,
		"sourceDriveId": "1FQQSSae8_pSBPvqhZeIP-vxOopp1mESs",
		"downloadPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-01-white-ai.ai",
		"thumbnailPath": "",
		"fileName": "governon-professionalai-logo-01-white-ai.ai",
		"fileFormat": "AI"
	},
	"governon-professionalai-logo-01-black-png": {
		"mirrored": false,
		"sourceDriveId": "1d9KD96OOXUfc0zWrKiuL1isyq9kbcn1e",
		"downloadPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-01-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-01-black-png.png",
		"fileName": "governon-professionalai-logo-01-black-png.png",
		"fileFormat": "PNG"
	},
	"governon-professionalai-logo-01-white-png": {
		"mirrored": false,
		"sourceDriveId": "1WIRFFsvn8t6y9VBYAG-Qt2ABKAHwihWB",
		"downloadPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-01-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-01-white-png.png",
		"fileName": "governon-professionalai-logo-01-white-png.png",
		"fileFormat": "PNG"
	},
	"governon-professionalai-logo-02-black-ai": {
		"mirrored": false,
		"sourceDriveId": "1QikKeTr4ovHZC2LoFm6tgejvNQCMV2NR",
		"downloadPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-02-black-ai.ai",
		"thumbnailPath": "",
		"fileName": "governon-professionalai-logo-02-black-ai.ai",
		"fileFormat": "AI"
	},
	"governon-professionalai-logo-02-white-ai": {
		"mirrored": false,
		"sourceDriveId": "14Xefl7vB6BZoiMrIk-DeMsW7iYOf2l3n",
		"downloadPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-02-white-ai.ai",
		"thumbnailPath": "",
		"fileName": "governon-professionalai-logo-02-white-ai.ai",
		"fileFormat": "AI"
	},
	"governon-professionalai-logo-02-black-png": {
		"mirrored": false,
		"sourceDriveId": "1FwOqMitwv6rnFMkbrHTXNLvoIWzTmyoc",
		"downloadPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-02-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-02-black-png.png",
		"fileName": "governon-professionalai-logo-02-black-png.png",
		"fileFormat": "PNG"
	},
	"governon-professionalai-logo-02-white-png": {
		"mirrored": false,
		"sourceDriveId": "1pXUZska4UPnLZMHdrX6pRzHQxSwkVCEJ",
		"downloadPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-02-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-02-white-png.png",
		"fileName": "governon-professionalai-logo-02-white-png.png",
		"fileFormat": "PNG"
	},
	"governon-professionalai-logo-03-black-ai": {
		"mirrored": false,
		"sourceDriveId": "12s-6Tn75mP2oxe7bsoHYSCWzyl2rcEO9",
		"downloadPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-03-black-ai.ai",
		"thumbnailPath": "",
		"fileName": "governon-professionalai-logo-03-black-ai.ai",
		"fileFormat": "AI"
	},
	"governon-professionalai-logo-03-white-ai": {
		"mirrored": false,
		"sourceDriveId": "1w_GkYskY0ajjdAkHCUzb-d37JuzRHqLz",
		"downloadPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-03-white-ai.ai",
		"thumbnailPath": "",
		"fileName": "governon-professionalai-logo-03-white-ai.ai",
		"fileFormat": "AI"
	},
	"governon-professionalai-logo-03-black-png": {
		"mirrored": false,
		"sourceDriveId": "1y7UDWbx9bfdLybpX4gd0PMUwcO6nhNgO",
		"downloadPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-03-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-03-black-png.png",
		"fileName": "governon-professionalai-logo-03-black-png.png",
		"fileFormat": "PNG"
	},
	"governon-professionalai-logo-03-white-png": {
		"mirrored": false,
		"sourceDriveId": "1Q4y9esYBJnA1zW53aTEBK3Na3Ba218WX",
		"downloadPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-03-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-03-white-png.png",
		"fileName": "governon-professionalai-logo-03-white-png.png",
		"fileFormat": "PNG"
	},
	"governon-professionalai-logo-04-black-ai": {
		"mirrored": false,
		"sourceDriveId": "1Ynebb50J2SeAGYe2CM_lqv0n2FJiWoYd",
		"downloadPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-04-black-ai.ai",
		"thumbnailPath": "",
		"fileName": "governon-professionalai-logo-04-black-ai.ai",
		"fileFormat": "AI"
	},
	"governon-professionalai-logo-04-white-ai": {
		"mirrored": false,
		"sourceDriveId": "1_gPF0wapRXgatg6aeb0-bAgnq93I2q5u",
		"downloadPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-04-white-ai.ai",
		"thumbnailPath": "",
		"fileName": "governon-professionalai-logo-04-white-ai.ai",
		"fileFormat": "AI"
	},
	"governon-professionalai-logo-04-black-png": {
		"mirrored": false,
		"sourceDriveId": "1ZpF3G-3aYTjaalHrrVx4WxeyMo9zVu2b",
		"downloadPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-04-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-04-black-png.png",
		"fileName": "governon-professionalai-logo-04-black-png.png",
		"fileFormat": "PNG"
	},
	"governon-professionalai-logo-04-white-png": {
		"mirrored": false,
		"sourceDriveId": "1XCeDVEkkmnNwPAvfbxBp6D1GB7dBqFK8",
		"downloadPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-04-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-professionalai-logo-04-white-png.png",
		"fileName": "governon-professionalai-logo-04-white-png.png",
		"fileFormat": "PNG"
	},
	"cxon-logo-primary-ai": {
		"mirrored": false,
		"sourceDriveId": "1C6ltXhFpWWNUYKS4yMi76k_8fPH6CIsS",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-logo-primary-ai.ai",
		"thumbnailPath": "",
		"fileName": "cxon-logo-primary-ai.ai",
		"fileFormat": "AI"
	},
	"cxon-logo-primary-color-png": {
		"mirrored": false,
		"sourceDriveId": "1vL6JUcZDfc7pF3BQy2U6RyLMYB0dNb7i",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-logo-primary-color-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-logo-primary-color-png.png",
		"fileName": "cxon-logo-primary-color-png.png",
		"fileFormat": "PNG"
	},
	"governon-brand-guidelines-pdf": {
		"mirrored": false,
		"sourceDriveId": "1YX4GAS8BeRke1EzmypBqfz7KfL0Oo_zT",
		"downloadPath": "brand-asset-portal-media/downloads/governon-brand-guidelines-pdf.pdf",
		"thumbnailPath": "",
		"fileName": "governon-brand-guidelines-pdf.pdf",
		"fileFormat": "PDF"
	},
	"cxon-logo-primary-black-png": {
		"mirrored": false,
		"sourceDriveId": "1ofVnEgvqS5jijgC1bnxgJP6NaIoFitG0",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-logo-primary-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-logo-primary-black-png.png",
		"fileName": "cxon-logo-primary-black-png.png",
		"fileFormat": "PNG"
	},
	"cxon-logo-primary-white-png": {
		"mirrored": false,
		"sourceDriveId": "1ytYtLVwhTWYgk4910vuU3IiOMKBHcPJq",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-logo-primary-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-logo-primary-white-png.png",
		"fileName": "cxon-logo-primary-white-png.png",
		"fileFormat": "PNG"
	},
	"cxon-professionalai-logo-01-black-ai": {
		"mirrored": false,
		"sourceDriveId": "1-tO422Q5BSP-gHUdT3ze9vDp4YU8pyZ9",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-01-black-ai.ai",
		"thumbnailPath": "",
		"fileName": "cxon-professionalai-logo-01-black-ai.ai",
		"fileFormat": "AI"
	},
	"cxon-professionalai-logo-01-white-ai": {
		"mirrored": false,
		"sourceDriveId": "1O52I32VnMunzfUFKVtkjU2e55OybtcPo",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-01-white-ai.ai",
		"thumbnailPath": "",
		"fileName": "cxon-professionalai-logo-01-white-ai.ai",
		"fileFormat": "AI"
	},
	"cxon-professionalai-logo-01-black-png": {
		"mirrored": false,
		"sourceDriveId": "11Jp3248t496DUC1l1gkrQW6IRHDre0Bm",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-01-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-01-black-png.png",
		"fileName": "cxon-professionalai-logo-01-black-png.png",
		"fileFormat": "PNG"
	},
	"cxon-professionalai-logo-01-white-png": {
		"mirrored": false,
		"sourceDriveId": "1naF1fBPAbqjQ4jiwmeV3jWcHYFWsdPxV",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-01-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-01-white-png.png",
		"fileName": "cxon-professionalai-logo-01-white-png.png",
		"fileFormat": "PNG"
	},
	"cxon-professionalai-logo-02-black-ai": {
		"mirrored": false,
		"sourceDriveId": "1qi-SNnO1XSLnmL2feQl8lULT8xKkHdi2",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-02-black-ai.ai",
		"thumbnailPath": "",
		"fileName": "cxon-professionalai-logo-02-black-ai.ai",
		"fileFormat": "AI"
	},
	"cxon-professionalai-logo-02-white-ai": {
		"mirrored": false,
		"sourceDriveId": "1ggkHwGeWy8y5OUuBnqvS26GSi19qFWOI",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-02-white-ai.ai",
		"thumbnailPath": "",
		"fileName": "cxon-professionalai-logo-02-white-ai.ai",
		"fileFormat": "AI"
	},
	"cxon-professionalai-logo-02-black-png": {
		"mirrored": false,
		"sourceDriveId": "1-6fiU3o-Be8GQ-50VRIud2RfwjTM6JHC",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-02-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-02-black-png.png",
		"fileName": "cxon-professionalai-logo-02-black-png.png",
		"fileFormat": "PNG"
	},
	"cxon-professionalai-logo-02-white-png": {
		"mirrored": false,
		"sourceDriveId": "1BJ4fy6BTv8SP2QVAb8-2KkW_hfkuer0E",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-02-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-02-white-png.png",
		"fileName": "cxon-professionalai-logo-02-white-png.png",
		"fileFormat": "PNG"
	},
	"cxon-professionalai-logo-03-black-ai": {
		"mirrored": false,
		"sourceDriveId": "1LrxJd6f5wamT9HorZQcGYpEh_iJ3cEC9",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-03-black-ai.ai",
		"thumbnailPath": "",
		"fileName": "cxon-professionalai-logo-03-black-ai.ai",
		"fileFormat": "AI"
	},
	"cxon-professionalai-logo-03-white-ai": {
		"mirrored": false,
		"sourceDriveId": "1FoFTh6Nl2tj2nonH2aOtQA9PLNVrWwHp",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-03-white-ai.ai",
		"thumbnailPath": "",
		"fileName": "cxon-professionalai-logo-03-white-ai.ai",
		"fileFormat": "AI"
	},
	"cxon-professionalai-logo-03-black-png": {
		"mirrored": false,
		"sourceDriveId": "1vQ4tHxEdYeu412C1_Ub8muC2UVoM6JMD",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-03-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-03-black-png.png",
		"fileName": "cxon-professionalai-logo-03-black-png.png",
		"fileFormat": "PNG"
	},
	"cxon-professionalai-logo-03-white-png": {
		"mirrored": false,
		"sourceDriveId": "1H7VMynILaP0l08xYmLcSoEp1ER4MwqMD",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-03-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-03-white-png.png",
		"fileName": "cxon-professionalai-logo-03-white-png.png",
		"fileFormat": "PNG"
	},
	"cxon-professionalai-logo-04-black-ai": {
		"mirrored": false,
		"sourceDriveId": "1I0yj4Yh3LLLgwMarZjmhuowJHmTZi7-3",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-04-black-ai.ai",
		"thumbnailPath": "",
		"fileName": "cxon-professionalai-logo-04-black-ai.ai",
		"fileFormat": "AI"
	},
	"cxon-professionalai-logo-04-white-ai": {
		"mirrored": false,
		"sourceDriveId": "12Lyyu6Z-PWH5NxnyFl3bmHBnPeS9RFeB",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-04-white-ai.ai",
		"thumbnailPath": "",
		"fileName": "cxon-professionalai-logo-04-white-ai.ai",
		"fileFormat": "AI"
	},
	"cxon-professionalai-logo-04-black-png": {
		"mirrored": false,
		"sourceDriveId": "1U16wu48L2PQ-kzLDM38vDLmKD1a8ZWd6",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-04-black-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-04-black-png.png",
		"fileName": "cxon-professionalai-logo-04-black-png.png",
		"fileFormat": "PNG"
	},
	"cxon-professionalai-logo-04-white-png": {
		"mirrored": false,
		"sourceDriveId": "1SToPnjBu_MCRIj7EKYHWfZuRlyNN4USO",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-04-white-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-professionalai-logo-04-white-png.png",
		"fileName": "cxon-professionalai-logo-04-white-png.png",
		"fileFormat": "PNG"
	},
	"cxon-logo-primary-color-jpg": {
		"mirrored": false,
		"sourceDriveId": "1NBD0Sroe0_YICUkDZ8kFQRL0V0okbouS",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-logo-primary-color-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-logo-primary-color-jpg.jpg",
		"fileName": "cxon-logo-primary-color-jpg.jpg",
		"fileFormat": "JPG"
	},
	"cxon-logo-primary-black-jpg": {
		"mirrored": false,
		"sourceDriveId": "1qKUKQI1DpXbOvx95dydR23NLMmABmD6I",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-logo-primary-black-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-logo-primary-black-jpg.jpg",
		"fileName": "cxon-logo-primary-black-jpg.jpg",
		"fileFormat": "JPG"
	},
	"cxon-logo-primary-white-light-jpg": {
		"mirrored": false,
		"sourceDriveId": "1LcpW7EOrs1fLyo0VZa0z3tXVLqgkuAQn",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-logo-primary-white-light-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-logo-primary-white-light-jpg.jpg",
		"fileName": "cxon-logo-primary-white-light-jpg.jpg",
		"fileFormat": "JPG"
	},
	"cxon-logo-primary-white-dark-jpg": {
		"mirrored": false,
		"sourceDriveId": "1dqvAWKp0-oLsWoq9kMMO_ruFHRTLcfnF",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-logo-primary-white-dark-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-logo-primary-white-dark-jpg.jpg",
		"fileName": "cxon-logo-primary-white-dark-jpg.jpg",
		"fileFormat": "JPG"
	},
	"cxon-brand-guidelines-pdf": {
		"mirrored": false,
		"sourceDriveId": "1ygGUE0w4bJqAQv7b8LCLxR3rEtmsLGS0",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-brand-guidelines-pdf.pdf",
		"thumbnailPath": "",
		"fileName": "cxon-brand-guidelines-pdf.pdf",
		"fileFormat": "PDF"
	},
	"legalon-illustration-202401008-item-ai": {
		"mirrored": false,
		"sourceDriveId": "1d1nF3hM0-OAPXutwJr8jhPkWuAca17_b",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-202401008-item-ai.ai",
		"thumbnailPath": "",
		"fileName": "legalon-illustration-202401008-item-ai.ai",
		"fileFormat": "AI"
	},
	"legalon-illustration-documentbox-png": {
		"mirrored": false,
		"sourceDriveId": "1evDzFB0EzgQK-jNRfk4VlcTPTiErSTDE",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-documentbox-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-documentbox-png.png",
		"fileName": "legalon-illustration-documentbox-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-llm-png": {
		"mirrored": false,
		"sourceDriveId": "1LEUSHZ8IDdU3ANG3sigbu0sqy3NyLaia",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-llm-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-llm-png.png",
		"fileName": "legalon-illustration-llm-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-contract-risk-png": {
		"mirrored": false,
		"sourceDriveId": "1byagqEjAYOO-KiTPxX0Es4i73UiIAyqf",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-contract-risk-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-contract-risk-png.png",
		"fileName": "legalon-illustration-contract-risk-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-contract-conclusion-png": {
		"mirrored": false,
		"sourceDriveId": "1Kk85_bsZHwQ4f_GRayUifdgKxp_QlKx2",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-contract-conclusion-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-contract-conclusion-png.png",
		"fileName": "legalon-illustration-contract-conclusion-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-search-png": {
		"mirrored": false,
		"sourceDriveId": "1BnSrdbFatk35zxxtEkPj_6VrpyJDYlM7",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-search-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-search-png.png",
		"fileName": "legalon-illustration-search-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-pc-contract-png": {
		"mirrored": false,
		"sourceDriveId": "1pYZQrKVTq-f5_iCBhO329notsVIBSZjg",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-pc-contract-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-pc-contract-png.png",
		"fileName": "legalon-illustration-pc-contract-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-localaccess-png": {
		"mirrored": false,
		"sourceDriveId": "1z3DrSqHgMd-qI7j2u2HjdVVxiXXGg2Ti",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-localaccess-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-localaccess-png.png",
		"fileName": "legalon-illustration-localaccess-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-contract-edit-png": {
		"mirrored": false,
		"sourceDriveId": "1feBOsAid4aJQmY_y3O1PegxMCA6fxfeo",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-contract-edit-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-contract-edit-png.png",
		"fileName": "legalon-illustration-contract-edit-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-edithistory-png": {
		"mirrored": false,
		"sourceDriveId": "1W1bOLv3CJO68HbzYm04QQMKph-Ar-ZjO",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-edithistory-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-edithistory-png.png",
		"fileName": "legalon-illustration-edithistory-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-authoritymanagement-png": {
		"mirrored": false,
		"sourceDriveId": "1b4B3GrxEd9cVdwpgrh_NkjymU2TXZxd8",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-authoritymanagement-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-authoritymanagement-png.png",
		"fileName": "legalon-illustration-authoritymanagement-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-comment-png": {
		"mirrored": false,
		"sourceDriveId": "1-AJPO9fgFm7cxf8OpXvO3m9_IvVkcipp",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-comment-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-comment-png.png",
		"fileName": "legalon-illustration-comment-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-court-png": {
		"mirrored": false,
		"sourceDriveId": "1e7UQ7t_j8L4U23f3PgBVkse-X__iR_Jz",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-court-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-court-png.png",
		"fileName": "legalon-illustration-court-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-browser-pop-png": {
		"mirrored": false,
		"sourceDriveId": "1JEN_2zHeNcmBB6iVBk6yNUm8rQ1J2ogl",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-browser-pop-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-browser-pop-png.png",
		"fileName": "legalon-illustration-browser-pop-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-graph-circle-png": {
		"mirrored": false,
		"sourceDriveId": "1T_6FQxBZUKeUs2rcUnBm8_xvWTa3R7CM",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-graph-circle-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-graph-circle-png.png",
		"fileName": "legalon-illustration-graph-circle-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-graph-bar-png": {
		"mirrored": false,
		"sourceDriveId": "1Ob_3Rkk9vJHXTULsjySlBD0-HWpbmhdi",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-graph-bar-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-graph-bar-png.png",
		"fileName": "legalon-illustration-graph-bar-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-review-png": {
		"mirrored": false,
		"sourceDriveId": "1RTjPVys7dR-RSmegSXiaDF1SzIkCSJJk",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-review-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-review-png.png",
		"fileName": "legalon-illustration-review-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-workmanagement-png": {
		"mirrored": false,
		"sourceDriveId": "1mdLvjZ_DkbIe_sXFXWoPvp6LX9GXRD5h",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-workmanagement-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-workmanagement-png.png",
		"fileName": "legalon-illustration-workmanagement-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-legaldocumentgraph-png": {
		"mirrored": false,
		"sourceDriveId": "11D3vxVjVXlAX1BZ1qlJZ3pZsroHU4pkv",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-legaldocumentgraph-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-legaldocumentgraph-png.png",
		"fileName": "legalon-illustration-legaldocumentgraph-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-book-png": {
		"mirrored": false,
		"sourceDriveId": "1h2ub5NeUZitHBkw9WAFPdB2T0Yyl9AbW",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-book-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-book-png.png",
		"fileName": "legalon-illustration-book-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-balance-png": {
		"mirrored": false,
		"sourceDriveId": "1VQrPJmR3mYopVthMxwdZOO8jnYLThCBH",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-balance-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-balance-png.png",
		"fileName": "legalon-illustration-balance-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-knowledge-png": {
		"mirrored": false,
		"sourceDriveId": "1OivgUfntxolABbfvfbmnPB9WpVOlBqOZ",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-knowledge-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-knowledge-png.png",
		"fileName": "legalon-illustration-knowledge-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-contract-png": {
		"mirrored": false,
		"sourceDriveId": "1d2BPNmxJueScc18-TNRQRAGeanBiIF3V",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-contract-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-contract-png.png",
		"fileName": "legalon-illustration-contract-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-mail-png": {
		"mirrored": false,
		"sourceDriveId": "1sXRLf4JuAJV-hNefIwNL5C8PrvUrQpDY",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-mail-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-mail-png.png",
		"fileName": "legalon-illustration-mail-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-searchfunction-png": {
		"mirrored": false,
		"sourceDriveId": "1GXiezrLQNNSYR4sXLR14Z5ezAeGsRRyR",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-searchfunction-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-searchfunction-png.png",
		"fileName": "legalon-illustration-searchfunction-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-document-png": {
		"mirrored": false,
		"sourceDriveId": "1JCFUS05dPySnTDsfJ0RdIeq-sDOaGaDI",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-document-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-document-png.png",
		"fileName": "legalon-illustration-document-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-pc-browser-png": {
		"mirrored": false,
		"sourceDriveId": "1xA8gI0diPjQNIAyjPBQG0mtQXUDg9Y6D",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-pc-browser-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-pc-browser-png.png",
		"fileName": "legalon-illustration-pc-browser-png.png",
		"fileFormat": "PNG"
	},
	"legalon-illustration-browser-edit-png": {
		"mirrored": false,
		"sourceDriveId": "1AMTz60Pyr0RyLv3QUIR5mdVPcePDFyVi",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-illustration-browser-edit-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-illustration-browser-edit-png.png",
		"fileName": "legalon-illustration-browser-edit-png.png",
		"fileFormat": "PNG"
	},
	"legalon-3d-visual-f-png": {
		"mirrored": false,
		"sourceDriveId": "1cMFZQyN21f8SJBLRWJ0l4q37gdYDt6gG",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-3d-visual-f-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-3d-visual-f-png.png",
		"fileName": "legalon-3d-visual-f-png.png",
		"fileFormat": "PNG"
	},
	"legalon-3d-visual-b-png": {
		"mirrored": false,
		"sourceDriveId": "1RqqZBg-9oQGEvRdMrXYhhm1G-QemhowY",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-3d-visual-b-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-3d-visual-b-png.png",
		"fileName": "legalon-3d-visual-b-png.png",
		"fileFormat": "PNG"
	},
	"legalon-3d-visual-c-png": {
		"mirrored": false,
		"sourceDriveId": "1CXiZtB2mPXibSN8VEeRQzkciwkaq2m5D",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-3d-visual-c-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-3d-visual-c-png.png",
		"fileName": "legalon-3d-visual-c-png.png",
		"fileFormat": "PNG"
	},
	"legalon-3d-visual-a-png": {
		"mirrored": false,
		"sourceDriveId": "1EMFwBvfIYoatODPfZo5nZvyROpb1NvNt",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-3d-visual-a-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-3d-visual-a-png.png",
		"fileName": "legalon-3d-visual-a-png.png",
		"fileFormat": "PNG"
	},
	"legalon-3d-visual-d-png": {
		"mirrored": false,
		"sourceDriveId": "16n8GTOg83U0TwjSIfvlfaxBd2ZE9T4Vy",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-3d-visual-d-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-3d-visual-d-png.png",
		"fileName": "legalon-3d-visual-d-png.png",
		"fileFormat": "PNG"
	},
	"legalon-3d-visual-e-png": {
		"mirrored": false,
		"sourceDriveId": "1GflCCZ2Cz7ff8Oz1bIma3MAbVjhMN4Zi",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-3d-visual-e-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-3d-visual-e-png.png",
		"fileName": "legalon-3d-visual-e-png.png",
		"fileFormat": "PNG"
	},
	"legalon-3d-visual-screen-20251210-191628-png": {
		"mirrored": false,
		"sourceDriveId": "13WC9HegM_Nv7jXW-HdSwTIt2G1cblN8e",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-3d-visual-screen-20251210-191628-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-3d-visual-screen-20251210-191628-png.png",
		"fileName": "legalon-3d-visual-screen-20251210-191628-png.png",
		"fileFormat": "PNG"
	},
	"legalon-3d-visual-screen-20251210-191637-png": {
		"mirrored": false,
		"sourceDriveId": "13A59ARRsmdVlhEA-7YYuDcDjZ1Dt3MIh",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-3d-visual-screen-20251210-191637-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-3d-visual-screen-20251210-191637-png.png",
		"fileName": "legalon-3d-visual-screen-20251210-191637-png.png",
		"fileFormat": "PNG"
	},
	"governon-3d-visual-a-png": {
		"mirrored": false,
		"sourceDriveId": "12CDEVCvdLldR9dp9Ujox2XDoeRa34-2l",
		"downloadPath": "brand-asset-portal-media/downloads/governon-3d-visual-a-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-3d-visual-a-png.png",
		"fileName": "governon-3d-visual-a-png.png",
		"fileFormat": "PNG"
	},
	"governon-3d-visual-a-psd": {
		"mirrored": false,
		"sourceDriveId": "1dRHMALlTZuK6FzXq1e9cDfNsBHctorz8",
		"downloadPath": "brand-asset-portal-media/downloads/governon-3d-visual-a-psd.psd",
		"thumbnailPath": "",
		"fileName": "governon-3d-visual-a-psd.psd",
		"fileFormat": "PSD"
	},
	"governon-3d-visual-b-png": {
		"mirrored": false,
		"sourceDriveId": "1fio1SkVCkLUMBpYZ8i7XasIdejyi_mPZ",
		"downloadPath": "brand-asset-portal-media/downloads/governon-3d-visual-b-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-3d-visual-b-png.png",
		"fileName": "governon-3d-visual-b-png.png",
		"fileFormat": "PNG"
	},
	"governon-3d-visual-e-psd": {
		"mirrored": false,
		"sourceDriveId": "1mOC5yHQsEzuBqv5MVrpk3ZDpMcvQQR9P",
		"downloadPath": "brand-asset-portal-media/downloads/governon-3d-visual-e-psd.psd",
		"thumbnailPath": "",
		"fileName": "governon-3d-visual-e-psd.psd",
		"fileFormat": "PSD"
	},
	"governon-3d-visual-f-png": {
		"mirrored": false,
		"sourceDriveId": "12j4oOKte-e6CBS2PxejNZdWoJYI81EjS",
		"downloadPath": "brand-asset-portal-media/downloads/governon-3d-visual-f-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-3d-visual-f-png.png",
		"fileName": "governon-3d-visual-f-png.png",
		"fileFormat": "PNG"
	},
	"workon-3d-visual-x3-png": {
		"mirrored": false,
		"sourceDriveId": "14Ks2VReP_kteCVMOzFgrNWxwMZcyLOSY",
		"downloadPath": "brand-asset-portal-media/downloads/workon-3d-visual-x3-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-3d-visual-x3-png.png",
		"fileName": "workon-3d-visual-x3-png.png",
		"fileFormat": "PNG"
	},
	"workon-3d-visual-x3-psd": {
		"mirrored": false,
		"sourceDriveId": "1QRgyfaSsyGUz759lER6y91KuisBLwZo1",
		"downloadPath": "brand-asset-portal-media/downloads/workon-3d-visual-x3-psd.psd",
		"thumbnailPath": "",
		"fileName": "workon-3d-visual-x3-psd.psd",
		"fileFormat": "PSD"
	},
	"dealon-3d-visual-saleson-png": {
		"mirrored": false,
		"sourceDriveId": "1raWRR08wNr6egHp3kDrDX03QX00M8QIp",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-3d-visual-saleson-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-3d-visual-saleson-png.png",
		"fileName": "dealon-3d-visual-saleson-png.png",
		"fileFormat": "PNG"
	},
	"dealon-3d-visual-saleson-psd": {
		"mirrored": false,
		"sourceDriveId": "1rA0UWT9bAAB5v4kQo4tn0Boul_bdqa1I",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-3d-visual-saleson-psd.psd",
		"thumbnailPath": "",
		"fileName": "dealon-3d-visual-saleson-psd.psd",
		"fileFormat": "PSD"
	},
	"dealon-3d-visual-salesonx3-png": {
		"mirrored": false,
		"sourceDriveId": "17rOPbkXJmPH75v338PsKJr_WTerHaXxT",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-3d-visual-salesonx3-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-3d-visual-salesonx3-png.png",
		"fileName": "dealon-3d-visual-salesonx3-png.png",
		"fileFormat": "PNG"
	},
	"dealon-3d-visual-salesonx3-psd": {
		"mirrored": false,
		"sourceDriveId": "1xarQ8D1IOmLMVut23J6xLPVmQ7bZwloA",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-3d-visual-salesonx3-psd.psd",
		"thumbnailPath": "",
		"fileName": "dealon-3d-visual-salesonx3-psd.psd",
		"fileFormat": "PSD"
	},
	"cxon-3d-visual-main-png": {
		"mirrored": false,
		"sourceDriveId": "1QFlfKCDaA55Rq8RXe324tJijHEwHNJsD",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-3d-visual-main-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-3d-visual-main-png.png",
		"fileName": "cxon-3d-visual-main-png.png",
		"fileFormat": "PNG"
	},
	"cxon-3d-visual-main-psd": {
		"mirrored": false,
		"sourceDriveId": "1QHoAJsAHrOLe635gHDN5Fl7W-QQRwsBI",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-3d-visual-main-psd.psd",
		"thumbnailPath": "",
		"fileName": "cxon-3d-visual-main-psd.psd",
		"fileFormat": "PSD"
	},
	"cxon-3d-visual-ribon-cycle-png": {
		"mirrored": false,
		"sourceDriveId": "11tFG21p1q2Rp4T2oMhl7Hdh2iw2xdK7C",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-3d-visual-ribon-cycle-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-3d-visual-ribon-cycle-png.png",
		"fileName": "cxon-3d-visual-ribon-cycle-png.png",
		"fileFormat": "PNG"
	},
	"legalon-square-icon-svg": {
		"mirrored": false,
		"sourceDriveId": "1WoWNS1jTndaMWnuIGSBiSarUs9lITYIJ",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-square-icon-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-square-icon-svg.svg",
		"fileName": "legalon-square-icon-svg.svg",
		"fileFormat": "SVG"
	},
	"legalon-square-icon-bgink-svg": {
		"mirrored": false,
		"sourceDriveId": "1VnztB8b6XvRGPxE8OYiEgIR0ci4Ke-5v",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-square-icon-bgink-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-square-icon-bgink-svg.svg",
		"fileName": "legalon-square-icon-bgink-svg.svg",
		"fileFormat": "SVG"
	},
	"legalon-square-icon-ai": {
		"mirrored": false,
		"sourceDriveId": "1--F5zqOnmVKINGt-BdiAuCjJdiz2RGw0",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-square-icon-ai.ai",
		"thumbnailPath": "",
		"fileName": "legalon-square-icon-ai.ai",
		"fileFormat": "AI"
	},
	"legalon-square-icon-png": {
		"mirrored": false,
		"sourceDriveId": "13lTL4T8B88Thk142JJLZOEvY1z-gF39j",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-square-icon-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-square-icon-png.png",
		"fileName": "legalon-square-icon-png.png",
		"fileFormat": "PNG"
	},
	"legalon-square-icon-bgink-png": {
		"mirrored": false,
		"sourceDriveId": "1vuQ7lJhqzlFL6pkQZXV4vT6FjrLulfFI",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-square-icon-bgink-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-square-icon-bgink-png.png",
		"fileName": "legalon-square-icon-bgink-png.png",
		"fileFormat": "PNG"
	},
	"legalon-square-icon-jpg": {
		"mirrored": false,
		"sourceDriveId": "1tZudP9dso_XZY1EETBTqAsvxtian4Sas",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-square-icon-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-square-icon-jpg.jpg",
		"fileName": "legalon-square-icon-jpg.jpg",
		"fileFormat": "JPG"
	},
	"legalon-square-icon-bgink-jpg": {
		"mirrored": false,
		"sourceDriveId": "1dPnsgCQwbXS_5PyjqwfaztFjWvwqplpJ",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-square-icon-bgink-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-square-icon-bgink-jpg.jpg",
		"fileName": "legalon-square-icon-bgink-jpg.jpg",
		"fileFormat": "JPG"
	},
	"legalon-square-icon-compact-svg": {
		"mirrored": false,
		"sourceDriveId": "1CVD51Av2XCUffmd0qwkNpKDSOaJDAza8",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-square-icon-compact-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-square-icon-compact-svg.svg",
		"fileName": "legalon-square-icon-compact-svg.svg",
		"fileFormat": "SVG"
	},
	"legalon-square-icon-compact-bgink-svg": {
		"mirrored": false,
		"sourceDriveId": "1RIHDESPFGd7D5FhDtYk8bzX35WR9IZ9c",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-square-icon-compact-bgink-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-square-icon-compact-bgink-svg.svg",
		"fileName": "legalon-square-icon-compact-bgink-svg.svg",
		"fileFormat": "SVG"
	},
	"legalon-square-icon-compact-png": {
		"mirrored": false,
		"sourceDriveId": "1KZQT4bhrFWlboogyYxPi6HV2Rc6Fe4Ij",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-square-icon-compact-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-square-icon-compact-png.png",
		"fileName": "legalon-square-icon-compact-png.png",
		"fileFormat": "PNG"
	},
	"legalon-square-icon-compact-bgink-png": {
		"mirrored": false,
		"sourceDriveId": "124_tSHI5tXuAeB4_M6iEFKj-Fnvj-hhK",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-square-icon-compact-bgink-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-square-icon-compact-bgink-png.png",
		"fileName": "legalon-square-icon-compact-bgink-png.png",
		"fileFormat": "PNG"
	},
	"legalon-square-icon-compact-jpg": {
		"mirrored": false,
		"sourceDriveId": "1ayGsFp5ah91b9HWlRovcGfeDL2RqJOkK",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-square-icon-compact-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-square-icon-compact-jpg.jpg",
		"fileName": "legalon-square-icon-compact-jpg.jpg",
		"fileFormat": "JPG"
	},
	"legalon-square-icon-compact-bgink-jpg": {
		"mirrored": false,
		"sourceDriveId": "1dPnsgCQwbXS_5PyjqwfaztFjWvwqplpJ",
		"downloadPath": "brand-asset-portal-media/downloads/legalon-square-icon-compact-bgink-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/legalon-square-icon-compact-bgink-jpg.jpg",
		"fileName": "legalon-square-icon-compact-bgink-jpg.jpg",
		"fileFormat": "JPG"
	},
	"governon-square-icon-svg": {
		"mirrored": false,
		"sourceDriveId": "18M1-dyjvSk4hUDB3TyaKSEA-dXuHzOdE",
		"downloadPath": "brand-asset-portal-media/downloads/governon-square-icon-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-square-icon-svg.svg",
		"fileName": "governon-square-icon-svg.svg",
		"fileFormat": "SVG"
	},
	"governon-square-icon-bgink-svg": {
		"mirrored": false,
		"sourceDriveId": "1lF-I615F46UnNQJHNA4T7cPj3JtP-Fbk",
		"downloadPath": "brand-asset-portal-media/downloads/governon-square-icon-bgink-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-square-icon-bgink-svg.svg",
		"fileName": "governon-square-icon-bgink-svg.svg",
		"fileFormat": "SVG"
	},
	"governon-square-icon-ai": {
		"mirrored": false,
		"sourceDriveId": "1sKUm7YG_uMQKfH-54sQ915YOBjmcKYrH",
		"downloadPath": "brand-asset-portal-media/downloads/governon-square-icon-ai.ai",
		"thumbnailPath": "",
		"fileName": "governon-square-icon-ai.ai",
		"fileFormat": "AI"
	},
	"governon-square-icon-png": {
		"mirrored": false,
		"sourceDriveId": "1x65FK418XNFLh8dKWHtZQ7XYW5djW3cK",
		"downloadPath": "brand-asset-portal-media/downloads/governon-square-icon-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-square-icon-png.png",
		"fileName": "governon-square-icon-png.png",
		"fileFormat": "PNG"
	},
	"governon-square-icon-bgink-png": {
		"mirrored": false,
		"sourceDriveId": "1ikartHfYwlSlKYFjSbtRO1FRoHNtrLZK",
		"downloadPath": "brand-asset-portal-media/downloads/governon-square-icon-bgink-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-square-icon-bgink-png.png",
		"fileName": "governon-square-icon-bgink-png.png",
		"fileFormat": "PNG"
	},
	"governon-square-icon-jpg": {
		"mirrored": false,
		"sourceDriveId": "1fE0cI-Vb38tP07yBLKCaWecjqco2_kPW",
		"downloadPath": "brand-asset-portal-media/downloads/governon-square-icon-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-square-icon-jpg.jpg",
		"fileName": "governon-square-icon-jpg.jpg",
		"fileFormat": "JPG"
	},
	"governon-square-icon-bgink-jpg": {
		"mirrored": false,
		"sourceDriveId": "1nXV1b7ynGf13lV9c8f8EP1amgo1Hpu94",
		"downloadPath": "brand-asset-portal-media/downloads/governon-square-icon-bgink-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-square-icon-bgink-jpg.jpg",
		"fileName": "governon-square-icon-bgink-jpg.jpg",
		"fileFormat": "JPG"
	},
	"governon-square-icon-compact-svg": {
		"mirrored": false,
		"sourceDriveId": "183GVvxphqJGFxPTgT5HZ3t2LiE6bGsc9",
		"downloadPath": "brand-asset-portal-media/downloads/governon-square-icon-compact-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-square-icon-compact-svg.svg",
		"fileName": "governon-square-icon-compact-svg.svg",
		"fileFormat": "SVG"
	},
	"governon-square-icon-compact-bgink-svg": {
		"mirrored": false,
		"sourceDriveId": "1vQDxibkXBPzn4Kw1qxdq4Z7jK5spvkAr",
		"downloadPath": "brand-asset-portal-media/downloads/governon-square-icon-compact-bgink-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-square-icon-compact-bgink-svg.svg",
		"fileName": "governon-square-icon-compact-bgink-svg.svg",
		"fileFormat": "SVG"
	},
	"governon-square-icon-compact-png": {
		"mirrored": false,
		"sourceDriveId": "1142Vzwx-nxR4dA6LQ5aBk1ED4tUKquFl",
		"downloadPath": "brand-asset-portal-media/downloads/governon-square-icon-compact-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-square-icon-compact-png.png",
		"fileName": "governon-square-icon-compact-png.png",
		"fileFormat": "PNG"
	},
	"governon-square-icon-compact-bgink-png": {
		"mirrored": false,
		"sourceDriveId": "1dBXhwahWdyOu7V5kzJxROhHxZdzOJV7B",
		"downloadPath": "brand-asset-portal-media/downloads/governon-square-icon-compact-bgink-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-square-icon-compact-bgink-png.png",
		"fileName": "governon-square-icon-compact-bgink-png.png",
		"fileFormat": "PNG"
	},
	"governon-square-icon-compact-jpg": {
		"mirrored": false,
		"sourceDriveId": "1USTiGuTZ4_HPBA6Foi_BPdPBDnI47qgJ",
		"downloadPath": "brand-asset-portal-media/downloads/governon-square-icon-compact-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-square-icon-compact-jpg.jpg",
		"fileName": "governon-square-icon-compact-jpg.jpg",
		"fileFormat": "JPG"
	},
	"governon-square-icon-compact-bgink-jpg": {
		"mirrored": false,
		"sourceDriveId": "1X6v77HEbTDKiXANIUz2FuGIefZVBCuY9",
		"downloadPath": "brand-asset-portal-media/downloads/governon-square-icon-compact-bgink-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/governon-square-icon-compact-bgink-jpg.jpg",
		"fileName": "governon-square-icon-compact-bgink-jpg.jpg",
		"fileFormat": "JPG"
	},
	"workon-square-icon-svg": {
		"mirrored": false,
		"sourceDriveId": "1_k6Gx11mEX6AH4_8CBYw4WUDhKf7FR0r",
		"downloadPath": "brand-asset-portal-media/downloads/workon-square-icon-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-square-icon-svg.svg",
		"fileName": "workon-square-icon-svg.svg",
		"fileFormat": "SVG"
	},
	"workon-square-icon-bgink-svg": {
		"mirrored": false,
		"sourceDriveId": "1ReTR_RSh9MbVU5dc6NKwnoc5nk9RqlvR",
		"downloadPath": "brand-asset-portal-media/downloads/workon-square-icon-bgink-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-square-icon-bgink-svg.svg",
		"fileName": "workon-square-icon-bgink-svg.svg",
		"fileFormat": "SVG"
	},
	"workon-square-icon-ai": {
		"mirrored": false,
		"sourceDriveId": "1_6G1642Id2u7Ntv9vRgec8DKX-IyiZmD",
		"downloadPath": "brand-asset-portal-media/downloads/workon-square-icon-ai.ai",
		"thumbnailPath": "",
		"fileName": "workon-square-icon-ai.ai",
		"fileFormat": "AI"
	},
	"workon-square-icon-png": {
		"mirrored": false,
		"sourceDriveId": "1HpjYNEHcyO8R0WgytIovVPV8yKIQOmLj",
		"downloadPath": "brand-asset-portal-media/downloads/workon-square-icon-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-square-icon-png.png",
		"fileName": "workon-square-icon-png.png",
		"fileFormat": "PNG"
	},
	"workon-square-icon-bgink-png": {
		"mirrored": false,
		"sourceDriveId": "1l75HdOS8tMI04xX8m1sdAVJsKUOdlDf_",
		"downloadPath": "brand-asset-portal-media/downloads/workon-square-icon-bgink-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-square-icon-bgink-png.png",
		"fileName": "workon-square-icon-bgink-png.png",
		"fileFormat": "PNG"
	},
	"workon-square-icon-jpg": {
		"mirrored": false,
		"sourceDriveId": "1zm4hEynVExRVFIx4D13ICwl_u-EnF9jw",
		"downloadPath": "brand-asset-portal-media/downloads/workon-square-icon-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-square-icon-jpg.jpg",
		"fileName": "workon-square-icon-jpg.jpg",
		"fileFormat": "JPG"
	},
	"workon-square-icon-bgink-jpg": {
		"mirrored": false,
		"sourceDriveId": "1kh2R7tW7bSiH8-YpwncPS8mgC9WYEsyd",
		"downloadPath": "brand-asset-portal-media/downloads/workon-square-icon-bgink-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-square-icon-bgink-jpg.jpg",
		"fileName": "workon-square-icon-bgink-jpg.jpg",
		"fileFormat": "JPG"
	},
	"workon-square-icon-compact-svg": {
		"mirrored": false,
		"sourceDriveId": "15THhvomvuRNA0B7pDLNZv4dmf_SZXN7-",
		"downloadPath": "brand-asset-portal-media/downloads/workon-square-icon-compact-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-square-icon-compact-svg.svg",
		"fileName": "workon-square-icon-compact-svg.svg",
		"fileFormat": "SVG"
	},
	"workon-square-icon-compact-bgink-svg": {
		"mirrored": false,
		"sourceDriveId": "1WNJ8t9tAz2wWUE9ZjLGOEBnQ3y8GoVSi",
		"downloadPath": "brand-asset-portal-media/downloads/workon-square-icon-compact-bgink-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-square-icon-compact-bgink-svg.svg",
		"fileName": "workon-square-icon-compact-bgink-svg.svg",
		"fileFormat": "SVG"
	},
	"workon-square-icon-compact-png": {
		"mirrored": false,
		"sourceDriveId": "1HBupmE4hjlpos6TooGwfR1bSzbxYTgkX",
		"downloadPath": "brand-asset-portal-media/downloads/workon-square-icon-compact-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-square-icon-compact-png.png",
		"fileName": "workon-square-icon-compact-png.png",
		"fileFormat": "PNG"
	},
	"workon-square-icon-compact-bgink-png": {
		"mirrored": false,
		"sourceDriveId": "17ah4jvlOxj6jxOscipGPNtzNN2Gu4Fy8",
		"downloadPath": "brand-asset-portal-media/downloads/workon-square-icon-compact-bgink-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-square-icon-compact-bgink-png.png",
		"fileName": "workon-square-icon-compact-bgink-png.png",
		"fileFormat": "PNG"
	},
	"workon-square-icon-compact-jpg": {
		"mirrored": false,
		"sourceDriveId": "1fSirUE8QjS04Yii1eZKbsZ1Xwlc6BK8d",
		"downloadPath": "brand-asset-portal-media/downloads/workon-square-icon-compact-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-square-icon-compact-jpg.jpg",
		"fileName": "workon-square-icon-compact-jpg.jpg",
		"fileFormat": "JPG"
	},
	"workon-square-icon-compact-bgink-jpg": {
		"mirrored": false,
		"sourceDriveId": "1KQ5ob1T7nCHs7L0qr8P3PGS0wBaxSqe1",
		"downloadPath": "brand-asset-portal-media/downloads/workon-square-icon-compact-bgink-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/workon-square-icon-compact-bgink-jpg.jpg",
		"fileName": "workon-square-icon-compact-bgink-jpg.jpg",
		"fileFormat": "JPG"
	},
	"dealon-square-icon-svg": {
		"mirrored": false,
		"sourceDriveId": "1S52Y56Yh1WR_tcSL0xHt3sIMgghyXA2x",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-square-icon-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-square-icon-svg.svg",
		"fileName": "dealon-square-icon-svg.svg",
		"fileFormat": "SVG"
	},
	"dealon-square-icon-bgink-svg": {
		"mirrored": false,
		"sourceDriveId": "10bzL8Wl_A8NtEmmMvn5tDsV__IHjCLVZ",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-square-icon-bgink-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-square-icon-bgink-svg.svg",
		"fileName": "dealon-square-icon-bgink-svg.svg",
		"fileFormat": "SVG"
	},
	"dealon-square-icon-ai": {
		"mirrored": false,
		"sourceDriveId": "1gEsysh5CA8WRs3z091ZpDLWzROSxqMm7",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-square-icon-ai.ai",
		"thumbnailPath": "",
		"fileName": "dealon-square-icon-ai.ai",
		"fileFormat": "AI"
	},
	"dealon-square-icon-png": {
		"mirrored": false,
		"sourceDriveId": "191Q3KzcF5h16Xxcl2B5v7JlV_xxP8CBL",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-square-icon-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-square-icon-png.png",
		"fileName": "dealon-square-icon-png.png",
		"fileFormat": "PNG"
	},
	"dealon-square-icon-bgink-png": {
		"mirrored": false,
		"sourceDriveId": "1UD38LI3kiybJT09EwlzJXGfoTKmYVfyi",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-square-icon-bgink-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-square-icon-bgink-png.png",
		"fileName": "dealon-square-icon-bgink-png.png",
		"fileFormat": "PNG"
	},
	"dealon-square-icon-jpg": {
		"mirrored": false,
		"sourceDriveId": "19O0B88NiWO4rqgDyfSm_TkQPW_Sp3Mqm",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-square-icon-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-square-icon-jpg.jpg",
		"fileName": "dealon-square-icon-jpg.jpg",
		"fileFormat": "JPG"
	},
	"dealon-square-icon-bgink-jpg": {
		"mirrored": false,
		"sourceDriveId": "1fh642IwWBx_00d79HKFlWeFe5oNaVSuw",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-square-icon-bgink-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-square-icon-bgink-jpg.jpg",
		"fileName": "dealon-square-icon-bgink-jpg.jpg",
		"fileFormat": "JPG"
	},
	"dealon-square-icon-compact-svg": {
		"mirrored": false,
		"sourceDriveId": "18Jt9E-uBr1ep1W8FW_UOTJchkfO5zKt8",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-square-icon-compact-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-square-icon-compact-svg.svg",
		"fileName": "dealon-square-icon-compact-svg.svg",
		"fileFormat": "SVG"
	},
	"dealon-square-icon-compact-bgink-svg": {
		"mirrored": false,
		"sourceDriveId": "11_QqMtf74PcsF2kzOYdKuHi_HLnJMi-d",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-square-icon-compact-bgink-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-square-icon-compact-bgink-svg.svg",
		"fileName": "dealon-square-icon-compact-bgink-svg.svg",
		"fileFormat": "SVG"
	},
	"dealon-square-icon-compact-png": {
		"mirrored": false,
		"sourceDriveId": "1_E6SD_fwzzTxDBM-QOfWnMnd6Bqs8QdF",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-square-icon-compact-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-square-icon-compact-png.png",
		"fileName": "dealon-square-icon-compact-png.png",
		"fileFormat": "PNG"
	},
	"dealon-square-icon-compact-bgink-png": {
		"mirrored": false,
		"sourceDriveId": "1ySQVgTbWt_RzlEaO2-h67b_7DI334GoB",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-square-icon-compact-bgink-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-square-icon-compact-bgink-png.png",
		"fileName": "dealon-square-icon-compact-bgink-png.png",
		"fileFormat": "PNG"
	},
	"dealon-square-icon-compact-jpg": {
		"mirrored": false,
		"sourceDriveId": "1dBbCfiNvxqDYhrc5e00S3TyOERXzyaLU",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-square-icon-compact-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-square-icon-compact-jpg.jpg",
		"fileName": "dealon-square-icon-compact-jpg.jpg",
		"fileFormat": "JPG"
	},
	"dealon-square-icon-compact-bgink-jpg": {
		"mirrored": false,
		"sourceDriveId": "12q0Sf8sJjNRRsbup3S1nrh6hBkfF_jQB",
		"downloadPath": "brand-asset-portal-media/downloads/dealon-square-icon-compact-bgink-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/dealon-square-icon-compact-bgink-jpg.jpg",
		"fileName": "dealon-square-icon-compact-bgink-jpg.jpg",
		"fileFormat": "JPG"
	},
	"cxon-square-icon-svg": {
		"mirrored": false,
		"sourceDriveId": "1TQ-8FsPX83LqQpFPQwrkJJOP7LiQ2gFW",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-square-icon-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-square-icon-svg.svg",
		"fileName": "cxon-square-icon-svg.svg",
		"fileFormat": "SVG"
	},
	"cxon-square-icon-bgink-svg": {
		"mirrored": false,
		"sourceDriveId": "1fTUzT9c3-cIkCpaEneNlmJXniLfqhb5c",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-square-icon-bgink-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-square-icon-bgink-svg.svg",
		"fileName": "cxon-square-icon-bgink-svg.svg",
		"fileFormat": "SVG"
	},
	"cxon-square-icon-ai": {
		"mirrored": false,
		"sourceDriveId": "1im-nEqoNFM-hB1vODh4fu4ADLh_6Es6Q",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-square-icon-ai.ai",
		"thumbnailPath": "",
		"fileName": "cxon-square-icon-ai.ai",
		"fileFormat": "AI"
	},
	"cxon-square-icon-png": {
		"mirrored": false,
		"sourceDriveId": "1tvRi0SDy3rgprxC8QbyMYB2x_Coo4fXY",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-square-icon-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-square-icon-png.png",
		"fileName": "cxon-square-icon-png.png",
		"fileFormat": "PNG"
	},
	"cxon-square-icon-bgink-png": {
		"mirrored": false,
		"sourceDriveId": "1eRlU1v_s_Vm-x-WZyJfGjKBTEiUJnB4q",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-square-icon-bgink-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-square-icon-bgink-png.png",
		"fileName": "cxon-square-icon-bgink-png.png",
		"fileFormat": "PNG"
	},
	"cxon-square-icon-jpg": {
		"mirrored": false,
		"sourceDriveId": "1dfnW2eQZ6Frzeo4cB-K2dqWTnANuT4gl",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-square-icon-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-square-icon-jpg.jpg",
		"fileName": "cxon-square-icon-jpg.jpg",
		"fileFormat": "JPG"
	},
	"cxon-square-icon-bgink-jpg": {
		"mirrored": false,
		"sourceDriveId": "13BmEdzed7M3o_pLvfJIQ_QNGYEWGTPbF",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-square-icon-bgink-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-square-icon-bgink-jpg.jpg",
		"fileName": "cxon-square-icon-bgink-jpg.jpg",
		"fileFormat": "JPG"
	},
	"cxon-square-icon-compact-svg": {
		"mirrored": false,
		"sourceDriveId": "11hBAOpOUXP3FCz2fKIiZ6BI7qtbyRroc",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-square-icon-compact-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-square-icon-compact-svg.svg",
		"fileName": "cxon-square-icon-compact-svg.svg",
		"fileFormat": "SVG"
	},
	"cxon-square-icon-compact-bgink-svg": {
		"mirrored": false,
		"sourceDriveId": "1PFyiq279fgzz7AAmeObTbMXwHTEHRxO9",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-square-icon-compact-bgink-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-square-icon-compact-bgink-svg.svg",
		"fileName": "cxon-square-icon-compact-bgink-svg.svg",
		"fileFormat": "SVG"
	},
	"cxon-square-icon-compact-png": {
		"mirrored": false,
		"sourceDriveId": "1QkBqWx2jx9BUtyY6ZK2zM4Vct8-Yr8kZ",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-square-icon-compact-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-square-icon-compact-png.png",
		"fileName": "cxon-square-icon-compact-png.png",
		"fileFormat": "PNG"
	},
	"cxon-square-icon-compact-bgink-png": {
		"mirrored": false,
		"sourceDriveId": "1MqO1wveT-GL6CXVi7kjDvksJpIQrI09n",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-square-icon-compact-bgink-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-square-icon-compact-bgink-png.png",
		"fileName": "cxon-square-icon-compact-bgink-png.png",
		"fileFormat": "PNG"
	},
	"cxon-square-icon-compact-jpg": {
		"mirrored": false,
		"sourceDriveId": "1HP8h6ap2fDlYbS7KDoOKqVKnYeVzPHq-",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-square-icon-compact-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-square-icon-compact-jpg.jpg",
		"fileName": "cxon-square-icon-compact-jpg.jpg",
		"fileFormat": "JPG"
	},
	"cxon-square-icon-compact-bgink-jpg": {
		"mirrored": false,
		"sourceDriveId": "1x5VkTWa8EHjqb8r3MeFeFlosqc4VRJMl",
		"downloadPath": "brand-asset-portal-media/downloads/cxon-square-icon-compact-bgink-jpg.jpg",
		"thumbnailPath": "brand-asset-portal-media/downloads/cxon-square-icon-compact-bgink-jpg.jpg",
		"fileName": "cxon-square-icon-compact-bgink-jpg.jpg",
		"fileFormat": "JPG"
	},
	"shared-icon-18-icon-booksparkle-svg": {
		"mirrored": true,
		"sourceDriveId": "1jiGVaJzmvehTmhxIBIQ9qSVArkyIsM9z",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-18-icon-booksparkle-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-18-icon-booksparkle-svg.svg",
		"fileName": "shared-icon-18-icon-booksparkle-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-18-icon-booksparkle-png": {
		"mirrored": true,
		"sourceDriveId": "1YA_lMG42U_ldCDFpqwUSv990awb7i553",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-18-icon-booksparkle-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-18-icon-booksparkle-png.png",
		"fileName": "shared-icon-18-icon-booksparkle-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-22-icon-calendarwarning-svg": {
		"mirrored": true,
		"sourceDriveId": "1-MpuWcctY1gRFpmRDhlGs4nbMF32AdPn",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-22-icon-calendarwarning-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-22-icon-calendarwarning-svg.svg",
		"fileName": "shared-icon-22-icon-calendarwarning-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-22-icon-calendarwarning-png": {
		"mirrored": true,
		"sourceDriveId": "1BaJOjcAMNmsI0_fFUsOzKe1getEY6irv",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-22-icon-calendarwarning-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-22-icon-calendarwarning-png.png",
		"fileName": "shared-icon-22-icon-calendarwarning-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-01-icon-ai-revise-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-01-icon-ai-revise-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-01-icon-ai-revise-png.png",
		"fileName": "shared-icon-01-icon-ai-revise-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-02-icon-aligncenter-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-02-icon-aligncenter-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-02-icon-aligncenter-svg.svg",
		"fileName": "shared-icon-02-icon-aligncenter-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-02-icon-aligncenter-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-02-icon-aligncenter-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-02-icon-aligncenter-png.png",
		"fileName": "shared-icon-02-icon-aligncenter-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-03-icon-alignjustify-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-03-icon-alignjustify-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-03-icon-alignjustify-svg.svg",
		"fileName": "shared-icon-03-icon-alignjustify-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-03-icon-alignjustify-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-03-icon-alignjustify-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-03-icon-alignjustify-png.png",
		"fileName": "shared-icon-03-icon-alignjustify-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-04-icon-alignleft-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-04-icon-alignleft-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-04-icon-alignleft-svg.svg",
		"fileName": "shared-icon-04-icon-alignleft-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-04-icon-alignleft-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-04-icon-alignleft-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-04-icon-alignleft-png.png",
		"fileName": "shared-icon-04-icon-alignleft-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-05-icon-alignright-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-05-icon-alignright-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-05-icon-alignright-svg.svg",
		"fileName": "shared-icon-05-icon-alignright-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-05-icon-alignright-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-05-icon-alignright-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-05-icon-alignright-png.png",
		"fileName": "shared-icon-05-icon-alignright-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-06-icon-archive-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-06-icon-archive-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-06-icon-archive-svg.svg",
		"fileName": "shared-icon-06-icon-archive-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-06-icon-archive-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-06-icon-archive-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-06-icon-archive-png.png",
		"fileName": "shared-icon-06-icon-archive-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-07-icon-archivealt-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-07-icon-archivealt-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-07-icon-archivealt-svg.svg",
		"fileName": "shared-icon-07-icon-archivealt-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-07-icon-archivealt-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-07-icon-archivealt-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-07-icon-archivealt-png.png",
		"fileName": "shared-icon-07-icon-archivealt-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-08-icon-archivesparkle-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-08-icon-archivesparkle-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-08-icon-archivesparkle-png.png",
		"fileName": "shared-icon-08-icon-archivesparkle-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-09-icon-areasearch-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-09-icon-areasearch-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-09-icon-areasearch-svg.svg",
		"fileName": "shared-icon-09-icon-areasearch-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-09-icon-areasearch-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-09-icon-areasearch-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-09-icon-areasearch-png.png",
		"fileName": "shared-icon-09-icon-areasearch-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-10-icon-arrowrotateright-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-10-icon-arrowrotateright-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-10-icon-arrowrotateright-svg.svg",
		"fileName": "shared-icon-10-icon-arrowrotateright-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-10-icon-arrowrotateright-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-10-icon-arrowrotateright-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-10-icon-arrowrotateright-png.png",
		"fileName": "shared-icon-10-icon-arrowrotateright-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-11-icon-arrowsrotateanimated-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-11-icon-arrowsrotateanimated-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-11-icon-arrowsrotateanimated-svg.svg",
		"fileName": "shared-icon-11-icon-arrowsrotateanimated-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-11-icon-arrowsrotateanimated-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-11-icon-arrowsrotateanimated-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-11-icon-arrowsrotateanimated-png.png",
		"fileName": "shared-icon-11-icon-arrowsrotateanimated-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-12-icon-arrowup-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-12-icon-arrowup-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-12-icon-arrowup-svg.svg",
		"fileName": "shared-icon-12-icon-arrowup-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-12-icon-arrowup-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-12-icon-arrowup-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-12-icon-arrowup-png.png",
		"fileName": "shared-icon-12-icon-arrowup-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-13-icon-assistant-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-13-icon-assistant-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-13-icon-assistant-png.png",
		"fileName": "shared-icon-13-icon-assistant-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-14-icon-barsparkles-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-14-icon-barsparkles-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-14-icon-barsparkles-svg.svg",
		"fileName": "shared-icon-14-icon-barsparkles-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-14-icon-barsparkles-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-14-icon-barsparkles-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-14-icon-barsparkles-png.png",
		"fileName": "shared-icon-14-icon-barsparkles-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-15-icon-book-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-15-icon-book-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-15-icon-book-svg.svg",
		"fileName": "shared-icon-15-icon-book-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-15-icon-book-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-15-icon-book-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-15-icon-book-png.png",
		"fileName": "shared-icon-15-icon-book-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-16-icon-books-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-16-icon-books-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-16-icon-books-svg.svg",
		"fileName": "shared-icon-16-icon-books-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-16-icon-books-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-16-icon-books-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-16-icon-books-png.png",
		"fileName": "shared-icon-16-icon-books-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-17-icon-booksearch-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-17-icon-booksearch-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-17-icon-booksearch-svg.svg",
		"fileName": "shared-icon-17-icon-booksearch-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-17-icon-booksearch-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-17-icon-booksearch-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-17-icon-booksearch-png.png",
		"fileName": "shared-icon-17-icon-booksearch-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-19-icon-building-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-19-icon-building-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-19-icon-building-svg.svg",
		"fileName": "shared-icon-19-icon-building-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-19-icon-building-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-19-icon-building-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-19-icon-building-png.png",
		"fileName": "shared-icon-19-icon-building-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-20-icon-cabinet-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-20-icon-cabinet-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-20-icon-cabinet-svg.svg",
		"fileName": "shared-icon-20-icon-cabinet-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-20-icon-cabinet-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-20-icon-cabinet-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-20-icon-cabinet-png.png",
		"fileName": "shared-icon-20-icon-cabinet-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-21-icon-calendar-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-21-icon-calendar-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-21-icon-calendar-svg.svg",
		"fileName": "shared-icon-21-icon-calendar-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-21-icon-calendar-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-21-icon-calendar-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-21-icon-calendar-png.png",
		"fileName": "shared-icon-21-icon-calendar-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-23-icon-calendercheck-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-23-icon-calendercheck-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-23-icon-calendercheck-png.png",
		"fileName": "shared-icon-23-icon-calendercheck-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-24-icon-chart-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-24-icon-chart-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-24-icon-chart-svg.svg",
		"fileName": "shared-icon-24-icon-chart-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-24-icon-chart-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-24-icon-chart-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-24-icon-chart-png.png",
		"fileName": "shared-icon-24-icon-chart-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-25-icon-chartline-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-25-icon-chartline-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-25-icon-chartline-svg.svg",
		"fileName": "shared-icon-25-icon-chartline-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-25-icon-chartline-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-25-icon-chartline-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-25-icon-chartline-png.png",
		"fileName": "shared-icon-25-icon-chartline-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-26-icon-checkbook-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-26-icon-checkbook-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-26-icon-checkbook-svg.svg",
		"fileName": "shared-icon-26-icon-checkbook-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-26-icon-checkbook-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-26-icon-checkbook-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-26-icon-checkbook-png.png",
		"fileName": "shared-icon-26-icon-checkbook-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-27-icon-checkcircle-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-27-icon-checkcircle-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-27-icon-checkcircle-svg.svg",
		"fileName": "shared-icon-27-icon-checkcircle-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-27-icon-checkcircle-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-27-icon-checkcircle-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-27-icon-checkcircle-png.png",
		"fileName": "shared-icon-27-icon-checkcircle-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-28-icon-clock-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-28-icon-clock-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-28-icon-clock-svg.svg",
		"fileName": "shared-icon-28-icon-clock-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-28-icon-clock-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-28-icon-clock-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-28-icon-clock-png.png",
		"fileName": "shared-icon-28-icon-clock-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-29-icon-closecircle-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-29-icon-closecircle-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-29-icon-closecircle-svg.svg",
		"fileName": "shared-icon-29-icon-closecircle-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-29-icon-closecircle-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-29-icon-closecircle-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-29-icon-closecircle-png.png",
		"fileName": "shared-icon-29-icon-closecircle-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-30-icon-comment-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-30-icon-comment-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-30-icon-comment-svg.svg",
		"fileName": "shared-icon-30-icon-comment-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-30-icon-comment-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-30-icon-comment-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-30-icon-comment-png.png",
		"fileName": "shared-icon-30-icon-comment-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-31-icon-comments-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-31-icon-comments-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-31-icon-comments-svg.svg",
		"fileName": "shared-icon-31-icon-comments-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-31-icon-comments-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-31-icon-comments-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-31-icon-comments-png.png",
		"fileName": "shared-icon-31-icon-comments-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-32-icon-comparison-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-32-icon-comparison-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-32-icon-comparison-svg.svg",
		"fileName": "shared-icon-32-icon-comparison-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-32-icon-comparison-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-32-icon-comparison-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-32-icon-comparison-png.png",
		"fileName": "shared-icon-32-icon-comparison-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-33-icon-documentcheck-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-33-icon-documentcheck-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-33-icon-documentcheck-svg.svg",
		"fileName": "shared-icon-33-icon-documentcheck-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-33-icon-documentcheck-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-33-icon-documentcheck-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-33-icon-documentcheck-png.png",
		"fileName": "shared-icon-33-icon-documentcheck-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-34-icon-download-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-34-icon-download-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-34-icon-download-svg.svg",
		"fileName": "shared-icon-34-icon-download-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-34-icon-download-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-34-icon-download-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-34-icon-download-png.png",
		"fileName": "shared-icon-34-icon-download-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-35-icon-earth-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-35-icon-earth-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-35-icon-earth-svg.svg",
		"fileName": "shared-icon-35-icon-earth-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-35-icon-earth-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-35-icon-earth-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-35-icon-earth-png.png",
		"fileName": "shared-icon-35-icon-earth-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-36-icon-ellipsis-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-36-icon-ellipsis-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-36-icon-ellipsis-svg.svg",
		"fileName": "shared-icon-36-icon-ellipsis-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-36-icon-ellipsis-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-36-icon-ellipsis-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-36-icon-ellipsis-png.png",
		"fileName": "shared-icon-36-icon-ellipsis-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-37-icon-file-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-37-icon-file-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-37-icon-file-svg.svg",
		"fileName": "shared-icon-37-icon-file-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-37-icon-file-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-37-icon-file-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-37-icon-file-png.png",
		"fileName": "shared-icon-37-icon-file-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-38-icon-filecheck-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-38-icon-filecheck-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-38-icon-filecheck-svg.svg",
		"fileName": "shared-icon-38-icon-filecheck-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-38-icon-filecheck-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-38-icon-filecheck-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-38-icon-filecheck-png.png",
		"fileName": "shared-icon-38-icon-filecheck-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-39-icon-fileedit-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-39-icon-fileedit-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-39-icon-fileedit-svg.svg",
		"fileName": "shared-icon-39-icon-fileedit-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-39-icon-fileedit-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-39-icon-fileedit-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-39-icon-fileedit-png.png",
		"fileName": "shared-icon-39-icon-fileedit-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-40-icon-filegroup-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-40-icon-filegroup-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-40-icon-filegroup-svg.svg",
		"fileName": "shared-icon-40-icon-filegroup-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-40-icon-filegroup-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-40-icon-filegroup-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-40-icon-filegroup-png.png",
		"fileName": "shared-icon-40-icon-filegroup-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-41-icon-filelines-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-41-icon-filelines-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-41-icon-filelines-svg.svg",
		"fileName": "shared-icon-41-icon-filelines-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-41-icon-filelines-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-41-icon-filelines-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-41-icon-filelines-png.png",
		"fileName": "shared-icon-41-icon-filelines-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-42-icon-filelock-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-42-icon-filelock-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-42-icon-filelock-svg.svg",
		"fileName": "shared-icon-42-icon-filelock-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-42-icon-filelock-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-42-icon-filelock-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-42-icon-filelock-png.png",
		"fileName": "shared-icon-42-icon-filelock-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-43-icon-filepdf-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-43-icon-filepdf-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-43-icon-filepdf-svg.svg",
		"fileName": "shared-icon-43-icon-filepdf-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-43-icon-filepdf-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-43-icon-filepdf-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-43-icon-filepdf-png.png",
		"fileName": "shared-icon-43-icon-filepdf-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-44-icon-files-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-44-icon-files-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-44-icon-files-svg.svg",
		"fileName": "shared-icon-44-icon-files-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-44-icon-files-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-44-icon-files-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-44-icon-files-png.png",
		"fileName": "shared-icon-44-icon-files-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-45-icon-filesigned-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-45-icon-filesigned-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-45-icon-filesigned-svg.svg",
		"fileName": "shared-icon-45-icon-filesigned-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-45-icon-filesigned-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-45-icon-filesigned-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-45-icon-filesigned-png.png",
		"fileName": "shared-icon-45-icon-filesigned-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-46-icon-filessignature-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-46-icon-filessignature-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-46-icon-filessignature-svg.svg",
		"fileName": "shared-icon-46-icon-filessignature-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-46-icon-filessignature-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-46-icon-filessignature-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-46-icon-filessignature-png.png",
		"fileName": "shared-icon-46-icon-filessignature-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-47-icon-filewarning-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-47-icon-filewarning-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-47-icon-filewarning-svg.svg",
		"fileName": "shared-icon-47-icon-filewarning-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-47-icon-filewarning-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-47-icon-filewarning-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-47-icon-filewarning-png.png",
		"fileName": "shared-icon-47-icon-filewarning-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-48-icon-fileword-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-48-icon-fileword-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-48-icon-fileword-svg.svg",
		"fileName": "shared-icon-48-icon-fileword-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-48-icon-fileword-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-48-icon-fileword-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-48-icon-fileword-png.png",
		"fileName": "shared-icon-48-icon-fileword-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-49-icon-foldertree-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-49-icon-foldertree-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-49-icon-foldertree-svg.svg",
		"fileName": "shared-icon-49-icon-foldertree-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-49-icon-foldertree-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-49-icon-foldertree-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-49-icon-foldertree-png.png",
		"fileName": "shared-icon-49-icon-foldertree-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-50-icon-handshake-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-50-icon-handshake-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-50-icon-handshake-svg.svg",
		"fileName": "shared-icon-50-icon-handshake-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-50-icon-handshake-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-50-icon-handshake-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-50-icon-handshake-png.png",
		"fileName": "shared-icon-50-icon-handshake-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-51-icon-history-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-51-icon-history-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-51-icon-history-svg.svg",
		"fileName": "shared-icon-51-icon-history-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-51-icon-history-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-51-icon-history-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-51-icon-history-png.png",
		"fileName": "shared-icon-51-icon-history-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-52-icon-home-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-52-icon-home-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-52-icon-home-svg.svg",
		"fileName": "shared-icon-52-icon-home-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-52-icon-home-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-52-icon-home-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-52-icon-home-png.png",
		"fileName": "shared-icon-52-icon-home-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-53-icon-hourglass-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-53-icon-hourglass-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-53-icon-hourglass-svg.svg",
		"fileName": "shared-icon-53-icon-hourglass-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-53-icon-hourglass-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-53-icon-hourglass-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-53-icon-hourglass-png.png",
		"fileName": "shared-icon-53-icon-hourglass-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-54-icon-lightbulb-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-54-icon-lightbulb-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-54-icon-lightbulb-svg.svg",
		"fileName": "shared-icon-54-icon-lightbulb-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-54-icon-lightbulb-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-54-icon-lightbulb-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-54-icon-lightbulb-png.png",
		"fileName": "shared-icon-54-icon-lightbulb-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-55-icon-link-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-55-icon-link-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-55-icon-link-svg.svg",
		"fileName": "shared-icon-55-icon-link-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-55-icon-link-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-55-icon-link-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-55-icon-link-png.png",
		"fileName": "shared-icon-55-icon-link-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-56-icon-listbulleted-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-56-icon-listbulleted-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-56-icon-listbulleted-svg.svg",
		"fileName": "shared-icon-56-icon-listbulleted-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-56-icon-listbulleted-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-56-icon-listbulleted-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-56-icon-listbulleted-png.png",
		"fileName": "shared-icon-56-icon-listbulleted-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-57-icon-listcheck-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-57-icon-listcheck-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-57-icon-listcheck-png.png",
		"fileName": "shared-icon-57-icon-listcheck-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-58-icon-lock-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-58-icon-lock-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-58-icon-lock-svg.svg",
		"fileName": "shared-icon-58-icon-lock-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-58-icon-lock-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-58-icon-lock-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-58-icon-lock-png.png",
		"fileName": "shared-icon-58-icon-lock-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-59-icon-magnifyingglass-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-59-icon-magnifyingglass-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-59-icon-magnifyingglass-svg.svg",
		"fileName": "shared-icon-59-icon-magnifyingglass-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-59-icon-magnifyingglass-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-59-icon-magnifyingglass-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-59-icon-magnifyingglass-png.png",
		"fileName": "shared-icon-59-icon-magnifyingglass-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-60-icon-mail-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-60-icon-mail-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-60-icon-mail-svg.svg",
		"fileName": "shared-icon-60-icon-mail-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-60-icon-mail-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-60-icon-mail-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-60-icon-mail-png.png",
		"fileName": "shared-icon-60-icon-mail-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-61-icon-microphone-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-61-icon-microphone-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-61-icon-microphone-svg.svg",
		"fileName": "shared-icon-61-icon-microphone-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-61-icon-microphone-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-61-icon-microphone-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-61-icon-microphone-png.png",
		"fileName": "shared-icon-61-icon-microphone-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-62-icon-mirge-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-62-icon-mirge-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-62-icon-mirge-svg.svg",
		"fileName": "shared-icon-62-icon-mirge-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-62-icon-mirge-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-62-icon-mirge-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-62-icon-mirge-png.png",
		"fileName": "shared-icon-62-icon-mirge-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-63-icon-new-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-63-icon-new-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-63-icon-new-svg.svg",
		"fileName": "shared-icon-63-icon-new-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-63-icon-new-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-63-icon-new-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-63-icon-new-png.png",
		"fileName": "shared-icon-63-icon-new-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-64-icon-nodecircle-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-64-icon-nodecircle-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-64-icon-nodecircle-svg.svg",
		"fileName": "shared-icon-64-icon-nodecircle-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-64-icon-nodecircle-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-64-icon-nodecircle-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-64-icon-nodecircle-png.png",
		"fileName": "shared-icon-64-icon-nodecircle-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-65-icon-nodecirclesparkle-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-65-icon-nodecirclesparkle-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-65-icon-nodecirclesparkle-svg.svg",
		"fileName": "shared-icon-65-icon-nodecirclesparkle-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-65-icon-nodecirclesparkle-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-65-icon-nodecirclesparkle-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-65-icon-nodecirclesparkle-png.png",
		"fileName": "shared-icon-65-icon-nodecirclesparkle-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-66-icon-noteedit-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-66-icon-noteedit-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-66-icon-noteedit-svg.svg",
		"fileName": "shared-icon-66-icon-noteedit-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-66-icon-noteedit-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-66-icon-noteedit-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-66-icon-noteedit-png.png",
		"fileName": "shared-icon-66-icon-noteedit-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-67-icon-pen-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-67-icon-pen-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-67-icon-pen-svg.svg",
		"fileName": "shared-icon-67-icon-pen-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-67-icon-pen-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-67-icon-pen-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-67-icon-pen-png.png",
		"fileName": "shared-icon-67-icon-pen-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-68-icon-plugconnect-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-68-icon-plugconnect-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-68-icon-plugconnect-svg.svg",
		"fileName": "shared-icon-68-icon-plugconnect-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-68-icon-plugconnect-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-68-icon-plugconnect-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-68-icon-plugconnect-png.png",
		"fileName": "shared-icon-68-icon-plugconnect-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-69-icon-question-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-69-icon-question-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-69-icon-question-svg.svg",
		"fileName": "shared-icon-69-icon-question-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-69-icon-question-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-69-icon-question-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-69-icon-question-png.png",
		"fileName": "shared-icon-69-icon-question-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-70-icon-questioncircle-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-70-icon-questioncircle-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-70-icon-questioncircle-svg.svg",
		"fileName": "shared-icon-70-icon-questioncircle-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-70-icon-questioncircle-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-70-icon-questioncircle-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-70-icon-questioncircle-png.png",
		"fileName": "shared-icon-70-icon-questioncircle-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-71-icon-scalebalanced-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-71-icon-scalebalanced-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-71-icon-scalebalanced-svg.svg",
		"fileName": "shared-icon-71-icon-scalebalanced-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-71-icon-scalebalanced-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-71-icon-scalebalanced-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-71-icon-scalebalanced-png.png",
		"fileName": "shared-icon-71-icon-scalebalanced-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-72-icon-send-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-72-icon-send-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-72-icon-send-svg.svg",
		"fileName": "shared-icon-72-icon-send-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-72-icon-send-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-72-icon-send-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-72-icon-send-png.png",
		"fileName": "shared-icon-72-icon-send-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-73-icon-settings-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-73-icon-settings-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-73-icon-settings-svg.svg",
		"fileName": "shared-icon-73-icon-settings-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-73-icon-settings-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-73-icon-settings-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-73-icon-settings-png.png",
		"fileName": "shared-icon-73-icon-settings-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-74-icon-split-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-74-icon-split-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-74-icon-split-svg.svg",
		"fileName": "shared-icon-74-icon-split-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-74-icon-split-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-74-icon-split-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-74-icon-split-png.png",
		"fileName": "shared-icon-74-icon-split-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-75-icon-storage-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-75-icon-storage-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-75-icon-storage-svg.svg",
		"fileName": "shared-icon-75-icon-storage-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-75-icon-storage-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-75-icon-storage-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-75-icon-storage-png.png",
		"fileName": "shared-icon-75-icon-storage-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-76-icon-support-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-76-icon-support-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-76-icon-support-svg.svg",
		"fileName": "shared-icon-76-icon-support-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-76-icon-support-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-76-icon-support-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-76-icon-support-png.png",
		"fileName": "shared-icon-76-icon-support-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-77-icon-table-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-77-icon-table-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-77-icon-table-svg.svg",
		"fileName": "shared-icon-77-icon-table-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-77-icon-table-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-77-icon-table-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-77-icon-table-png.png",
		"fileName": "shared-icon-77-icon-table-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-78-icon-tag-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-78-icon-tag-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-78-icon-tag-svg.svg",
		"fileName": "shared-icon-78-icon-tag-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-78-icon-tag-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-78-icon-tag-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-78-icon-tag-png.png",
		"fileName": "shared-icon-78-icon-tag-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-79-icon-textsearch-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-79-icon-textsearch-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-79-icon-textsearch-svg.svg",
		"fileName": "shared-icon-79-icon-textsearch-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-79-icon-textsearch-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-79-icon-textsearch-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-79-icon-textsearch-png.png",
		"fileName": "shared-icon-79-icon-textsearch-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-80-icon-thumbs-up-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-80-icon-thumbs-up-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-80-icon-thumbs-up-svg.svg",
		"fileName": "shared-icon-80-icon-thumbs-up-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-80-icon-thumbs-up-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-80-icon-thumbs-up-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-80-icon-thumbs-up-png.png",
		"fileName": "shared-icon-80-icon-thumbs-up-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-81-icon-translate-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-81-icon-translate-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-81-icon-translate-svg.svg",
		"fileName": "shared-icon-81-icon-translate-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-81-icon-translate-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-81-icon-translate-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-81-icon-translate-png.png",
		"fileName": "shared-icon-81-icon-translate-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-82-icon-upload-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-82-icon-upload-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-82-icon-upload-svg.svg",
		"fileName": "shared-icon-82-icon-upload-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-82-icon-upload-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-82-icon-upload-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-82-icon-upload-png.png",
		"fileName": "shared-icon-82-icon-upload-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-83-icon-user-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-83-icon-user-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-83-icon-user-svg.svg",
		"fileName": "shared-icon-83-icon-user-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-83-icon-user-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-83-icon-user-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-83-icon-user-png.png",
		"fileName": "shared-icon-83-icon-user-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-84-icon-usergroup-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-84-icon-usergroup-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-84-icon-usergroup-svg.svg",
		"fileName": "shared-icon-84-icon-usergroup-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-84-icon-usergroup-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-84-icon-usergroup-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-84-icon-usergroup-png.png",
		"fileName": "shared-icon-84-icon-usergroup-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-85-icon-userquestion-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-85-icon-userquestion-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-85-icon-userquestion-svg.svg",
		"fileName": "shared-icon-85-icon-userquestion-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-85-icon-userquestion-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-85-icon-userquestion-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-85-icon-userquestion-png.png",
		"fileName": "shared-icon-85-icon-userquestion-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-86-icon-wand-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-86-icon-wand-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-86-icon-wand-svg.svg",
		"fileName": "shared-icon-86-icon-wand-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-86-icon-wand-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-86-icon-wand-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-86-icon-wand-png.png",
		"fileName": "shared-icon-86-icon-wand-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-87-icon-warningtriangle-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-87-icon-warningtriangle-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-87-icon-warningtriangle-svg.svg",
		"fileName": "shared-icon-87-icon-warningtriangle-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-87-icon-warningtriangle-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-87-icon-warningtriangle-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-87-icon-warningtriangle-png.png",
		"fileName": "shared-icon-87-icon-warningtriangle-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-88-icon-writing-sparkles-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-88-icon-writing-sparkles-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-88-icon-writing-sparkles-svg.svg",
		"fileName": "shared-icon-88-icon-writing-sparkles-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-88-icon-writing-sparkles-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-88-icon-writing-sparkles-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-88-icon-writing-sparkles-png.png",
		"fileName": "shared-icon-88-icon-writing-sparkles-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-89-icon-writing-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-89-icon-writing-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-89-icon-writing-svg.svg",
		"fileName": "shared-icon-89-icon-writing-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-89-icon-writing-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-89-icon-writing-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-89-icon-writing-png.png",
		"fileName": "shared-icon-89-icon-writing-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-90-icon-academy01-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-90-icon-academy01-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-90-icon-academy01-png.png",
		"fileName": "shared-icon-90-icon-academy01-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-91-icon-academy02-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-91-icon-academy02-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-91-icon-academy02-png.png",
		"fileName": "shared-icon-91-icon-academy02-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-92-icon-beginer-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-92-icon-beginer-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-92-icon-beginer-png.png",
		"fileName": "shared-icon-92-icon-beginer-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-93-icon-checklists-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-93-icon-checklists-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-93-icon-checklists-png.png",
		"fileName": "shared-icon-93-icon-checklists-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-94-icon-database-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-94-icon-database-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-94-icon-database-png.png",
		"fileName": "shared-icon-94-icon-database-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-95-icon-english-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-95-icon-english-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-95-icon-english-png.png",
		"fileName": "shared-icon-95-icon-english-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-96-icon-errorprevention-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-96-icon-errorprevention-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-96-icon-errorprevention-png.png",
		"fileName": "shared-icon-96-icon-errorprevention-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-97-icon-factory-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-97-icon-factory-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-97-icon-factory-png.png",
		"fileName": "shared-icon-97-icon-factory-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-98-icon-fileexcel-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-98-icon-fileexcel-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-98-icon-fileexcel-png.png",
		"fileName": "shared-icon-98-icon-fileexcel-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-99-icon-filepp-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-99-icon-filepp-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-99-icon-filepp-png.png",
		"fileName": "shared-icon-99-icon-filepp-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-100-icon-finance-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-100-icon-finance-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-100-icon-finance-png.png",
		"fileName": "shared-icon-100-icon-finance-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-101-icon-folder01-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-101-icon-folder01-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-101-icon-folder01-png.png",
		"fileName": "shared-icon-101-icon-folder01-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-102-icon-folder02-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-102-icon-folder02-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-102-icon-folder02-png.png",
		"fileName": "shared-icon-102-icon-folder02-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-103-icon-foldercontrol-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-103-icon-foldercontrol-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-103-icon-foldercontrol-png.png",
		"fileName": "shared-icon-103-icon-foldercontrol-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-104-icon-folderdl-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-104-icon-folderdl-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-104-icon-folderdl-png.png",
		"fileName": "shared-icon-104-icon-folderdl-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-105-icon-folderup-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-105-icon-folderup-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-105-icon-folderup-png.png",
		"fileName": "shared-icon-105-icon-folderup-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-106-icon-japanese-01-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-106-icon-japanese-01-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-106-icon-japanese-01-png.png",
		"fileName": "shared-icon-106-icon-japanese-01-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-107-icon-japanese-02-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-107-icon-japanese-02-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-107-icon-japanese-02-png.png",
		"fileName": "shared-icon-107-icon-japanese-02-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-108-icon-linkcontracts-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-108-icon-linkcontracts-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-108-icon-linkcontracts-png.png",
		"fileName": "shared-icon-108-icon-linkcontracts-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-109-icon-lists01-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-109-icon-lists01-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-109-icon-lists01-png.png",
		"fileName": "shared-icon-109-icon-lists01-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-110-icon-lists02-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-110-icon-lists02-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-110-icon-lists02-png.png",
		"fileName": "shared-icon-110-icon-lists02-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-111-icon-mail02-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-111-icon-mail02-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-111-icon-mail02-png.png",
		"fileName": "shared-icon-111-icon-mail02-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-112-icon-management-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-112-icon-management-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-112-icon-management-png.png",
		"fileName": "shared-icon-112-icon-management-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-113-icon-pcanalizing-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-113-icon-pcanalizing-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-113-icon-pcanalizing-png.png",
		"fileName": "shared-icon-113-icon-pcanalizing-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-114-icon-pcdownload-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-114-icon-pcdownload-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-114-icon-pcdownload-png.png",
		"fileName": "shared-icon-114-icon-pcdownload-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-115-icon-pcnote-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-115-icon-pcnote-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-115-icon-pcnote-png.png",
		"fileName": "shared-icon-115-icon-pcnote-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-116-icon-prohibited-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-116-icon-prohibited-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-116-icon-prohibited-png.png",
		"fileName": "shared-icon-116-icon-prohibited-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-117-icon-relatedcontracts-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-117-icon-relatedcontracts-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-117-icon-relatedcontracts-png.png",
		"fileName": "shared-icon-117-icon-relatedcontracts-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-118-icon-seminar-svg": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-118-icon-seminar-svg.svg",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-118-icon-seminar-svg.svg",
		"fileName": "shared-icon-118-icon-seminar-svg.svg",
		"fileFormat": "SVG"
	},
	"shared-icon-118-icon-seminar-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-118-icon-seminar-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-118-icon-seminar-png.png",
		"fileName": "shared-icon-118-icon-seminar-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-119-icon-stampedcontracts-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-119-icon-stampedcontracts-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-119-icon-stampedcontracts-png.png",
		"fileName": "shared-icon-119-icon-stampedcontracts-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-120-icon-technology-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-120-icon-technology-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-120-icon-technology-png.png",
		"fileName": "shared-icon-120-icon-technology-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-121-icon-user02-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-121-icon-user02-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-121-icon-user02-png.png",
		"fileName": "shared-icon-121-icon-user02-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-122-icon-user03-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-122-icon-user03-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-122-icon-user03-png.png",
		"fileName": "shared-icon-122-icon-user03-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-123-icon-user04-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-123-icon-user04-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-123-icon-user04-png.png",
		"fileName": "shared-icon-123-icon-user04-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-124-icon-usercomment-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-124-icon-usercomment-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-124-icon-usercomment-png.png",
		"fileName": "shared-icon-124-icon-usercomment-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-125-icon-usergroup02-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-125-icon-usergroup02-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-125-icon-usergroup02-png.png",
		"fileName": "shared-icon-125-icon-usergroup02-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-126-icon-usergroup03-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-126-icon-usergroup03-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-126-icon-usergroup03-png.png",
		"fileName": "shared-icon-126-icon-usergroup03-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-127-icon-userng-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-127-icon-userng-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-127-icon-userng-png.png",
		"fileName": "shared-icon-127-icon-userng-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-128-icon-userok-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-128-icon-userok-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-128-icon-userok-png.png",
		"fileName": "shared-icon-128-icon-userok-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-129-icon-utilization-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-129-icon-utilization-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-129-icon-utilization-png.png",
		"fileName": "shared-icon-129-icon-utilization-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-130-icon-value-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-130-icon-value-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-130-icon-value-png.png",
		"fileName": "shared-icon-130-icon-value-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-131-icon-version-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-131-icon-version-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-131-icon-version-png.png",
		"fileName": "shared-icon-131-icon-version-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-132-icon-vision-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-132-icon-vision-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-132-icon-vision-png.png",
		"fileName": "shared-icon-132-icon-vision-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-133-icon-warehouse-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-133-icon-warehouse-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-133-icon-warehouse-png.png",
		"fileName": "shared-icon-133-icon-warehouse-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-134-icon-workip-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-134-icon-workip-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-134-icon-workip-png.png",
		"fileName": "shared-icon-134-icon-workip-png.png",
		"fileFormat": "PNG"
	},
	"shared-icon-135-icon-workpatent-png": {
		"mirrored": true,
		"sourceDriveId": "",
		"downloadPath": "brand-asset-portal-media/downloads/shared-icon-135-icon-workpatent-png.png",
		"thumbnailPath": "brand-asset-portal-media/downloads/shared-icon-135-icon-workpatent-png.png",
		"fileName": "shared-icon-135-icon-workpatent-png.png",
		"fileFormat": "PNG"
	}
};
//#endregion
//#region scripts/brand-asset-display-metadata.ts
var sharedIconDriveIds = {
	SVG: {
		"AI Revise": "1sJvL8QpyMN5G3ura0ZViZVqF9Go9oGyq",
		AlignCenter: "1iNWMfmqnvQRD3bRWVmDLdqOAS9OqM1-2",
		AlignJustify: "19RfXogPR06cyqIS7ItM3vZt_jM95arfJ",
		AlignLeft: "1Nqqp05uSJnkCQDHhzGL0DewM-kEXF0L4",
		AlignRight: "1GZbfszvOa4_yKMB9yOx2H58f503VVIJ9",
		Archive: "1K9YPHsUSXuNLKR81A7zJbfHpmYQoNPvd",
		ArchiveAlt: "1dLkODe6DPFApVb85-kjPilbmOLleh3gE",
		ArchiveSparkle: "1Gn8r-B_V502ap_I2zu5JfoOWF0KhS70n",
		AreaSearch: "1WRasdH3wR8PxwVJUXblJ2MX7kcN5rTMu",
		ArrowRotateRight: "1wr4XrrXjvQu6GJOJbBsjyxQ4zivtK3R-",
		ArrowsRotateAnimated: "18aclZRHj6LdUlBCD9NS3ATcY8jZigYGy",
		ArrowUp: "186KstAZZVt4I24phSdwQv_LJ9KNYb9Yf",
		Assistant: "1ipAEglqzcqgrZ1p5pEwGja-PACuDTPuf",
		BarSparkles: "1VqMyGWe_zcuowq1fdLCup5takcAbAQPg",
		Book: "1OLLvpu-LLwOTqdhq88o-thwaTCUAyyFs",
		Books: "1rpL-sdwVRp0U1BoFbNvHwa50_tlpHN9B",
		BookSearch: "1tGXTj036cTqvDp8mKVlre9BEN8vUsFs3",
		BookSparkle: "1jiGVaJzmvehTmhxIBIQ9qSVArkyIsM9z",
		Building: "13uqXvuaWJPwuWMKgaYiUXrfAcVV49QYH",
		Cabinet: "1JXFkZVNswPrBOdLtoBdBLZhoc85M8tmf",
		Calendar: "1AZlwrkuir8IpMjDUayMtdPBAnXCs8dUM",
		CalendarWarning: "1-MpuWcctY1gRFpmRDhlGs4nbMF32AdPn",
		CalenderCheck: "1cFyvtleAKqaPe_LdZNS4jTTZPLO_eSBw",
		Chart: "1HnRlJa6RDuKRWlo-G1jwYHLSb8vt93Qa",
		ChartLine: "1RjUgkn5l1wfJUR4hzMZYVutwRZa1vXrv",
		CheckBook: "19MVAyJOS4SVx75WGmgv31AYIjYQKb9uP",
		CheckCircle: "1xWFRj5vfQcphT-SRe2ib61NdZg_b5I0L",
		Clock: "1-5oGPnZeXvjoFstt2vZDF3zmZsCAbtuw",
		CloseCircle: "1gqNJczjt4XzIYZjqDR4v4xcNFAZcm7bS",
		Comment: "1O5nt-x5cotHBlegzB4KfT9_ZgES8JfQ1",
		Comments: "11cwk5NyZ0--T4MIQuCQ5htPyZ1JNNsIY",
		Comparison: "1NMREiC1EdM9XcmrBoP2SZg3NKZgRdN26",
		DocumentCheck: "10KqAUd01FWL8UvJMPG-zE9ZO89Xxwp2S",
		Download: "1_cjqiMeyOZ01FPTFC5iEwXkrmVJJvyTC",
		Earth: "1_zeogcuG1BcElKHhvzAnlXfrAlPVQiuS",
		Ellipsis: "15NCwp1xBtS1bGqOKLrwGID6Mwk8Jf_cQ",
		File: "1ZDaveLOPYNt_KOqYM5fTHCnLAPzUQNhr",
		FileCheck: "15n3ULoAWVKgyaU_uNKpLhqTwS_WKM8Ks",
		FileEdit: "1azGnXctzlURyyXYiHvQedpJ-azmDSt46",
		FileGroup: "1jSEmIm5NrGYYsPFcLfJu56DrNNjMMcVn",
		FileLines: "1XfGFsYk8qWTzojvF3aH-zarAN_9grpHH",
		FileLock: "1z7ZyBB6SXANK2loauTSWn8ut3bnDhpaF",
		FilePdf: "1NHFrJ0PUgkJs4cK5hFRh8d3Jh3kyv4L0",
		Files: "1x4ofn6F7gauPOWK6rkvfOvNmRmtu6MKH",
		FileSigned: "1AYXcEdpUsNPUbAJf1ddMbXqi5ZM4J8n2",
		FilesSignature: "1dEsUgk9lVf240eILz58j5zpYLmGRwOZE",
		FileWarning: "19Bsup_LG9l5Ic6gP8wCW9HwkFP5oTD-S",
		FileWord: "10W5zhBUuy96W_D4ZPjHx38UZ-BZR-DOp",
		FolderTree: "18mEqVFX_yDQIyAR9k0AuKpJsECA7PM-l",
		Handshake: "1Wg6aZYqxXClvE5yr0M9zxDCWWvaev_I0",
		History: "10dGx_zkcJJFdo6rncfYj4-NXjSWzf_vn",
		Home: "1LeJNbSWS6ewrYQDRtobT-TqVCP6AzpH0",
		Hourglass: "1Dn0merv77Jte-ASlvywpYf24dhuKwcnC",
		Lightbulb: "1xswGukyG_nc27e4P5JuZ3B1w7U4E7pXL",
		Link: "13y8SjnH6RAhwBthw7_LqsUvpDtP4eCug",
		ListBulleted: "1_8cmyP0_BQ8-eU3QSQZYWnD45ftwSlyT",
		ListCheck: "1HA6SqaPZKuORS4_PFqKjYIS_MokA1iqV",
		Lock: "1Mi9L5NOEm13BKqdmSUpXWes7cmshthUn",
		MagnifyingGlass: "1TyWawWwH63iilVg8k298Afp2h83fx_3r",
		Mail: "1BC8nq9xgfooPWok93j-lDq7JW3dIr3sk",
		Microphone: "1wRVrX3YGIC-qRCP7Dcns_PLbMqWVlioS",
		Mirge: "1Y3bA6uQQx53oQud5NcAwvbbMc6qS3-eR",
		New: "1dR-3gaWacu_VVX-18oXWgaxDsOWaUVIw",
		NodeCircle: "1ZQMkO6UIvzcLrRW0Lzy-RcHa-cNTZGC9",
		NodeCircleSparkle: "1HhWh4xnQkKGvU9N7CeaIWu8AvQaRUu62",
		NoteEdit: "1Nq0SCJ4GHNm_1ZovHlA6moor3DnvOPqj",
		Pen: "1FnVPQgIquxUqbqulr9c_xLOzRPrWNqwF",
		PlugConnect: "1DMAdt1YajsgfPN4CQcVgqJeBXrDX9_S5",
		Question: "1HX5fotL8ZyxIyvK1cjRtjeXLNF9p6e8h",
		QuestionCircle: "1fPxIhkbGV7wOhdXZkUxwifpUDHCPBnmR",
		ScaleBalanced: "1f7plj85rmsgo0M5jmp1rhvA33XcwYRG0",
		Send: "1ItcxqbTZs-zkwdAk-k3Mcxv_1FeMk0e1",
		Settings: "1qM0ZqfsjP6EQbLKycyYJ6AiRZ8WN1VW4",
		Split: "1AvLOoFP1fLqZ4x7d1ZKvUB0_RCEWeJe-",
		Storage: "1nj7rABODQbGuDpqMvRd_xqbqZGGqXaGD",
		Support: "1zDsufLK9o75PgKaeTY8rio1Dd7Wx2cJ9",
		Table: "18mKuU9ET15WqtIdBdjRZAqGeqSV0go6h",
		Tag: "1-MpI568c_1tRZHtvDjsMJzmESIn0fTJQ",
		TextSearch: "1hGUr8MO2c7rttisigZTcnX7TvpudIfdS",
		"Thumbs Up": "181HUAxtWm0V4usmAKHbWhdUmXAoEOaju",
		Translate: "1FS-Wt1toNFfNqHksgDfs7cFYt04Oda6X",
		Upload: "1cdFxH3-G9rw0WM-sp-KtdO4Q7jnaTrAe",
		User: "11qQOLsyJc4oIHtuV2QDo1ToFYdEGIrbR",
		UserGroup: "1o6IDwFf6csax3SxnKt3htrX6je-mM34F",
		UserQuestion: "1TQQ2tzhZlcX0RSleVKzKzyjhhT5ggf1h",
		Wand: "13DxgEXZTZZ8L3cr9ux2M_EhcG2dRyKyz",
		WarningTriangle: "1Ys3MKT9RJAhAFmRBYF_VSG-VoS2QMwNq",
		"Writing Sparkles": "1frPa13HN1l9pZfpw3gAR05hajN0weiXN",
		Writing: "1W2bJ5KNdG3WBOAlilgkJHnt1k_qgTswZ",
		Academy01: "1yHieoRzTVm-CH8O-9dFZjk7KIMvlLET9",
		Academy02: "1_5KAYkWRgk_D2B0S9ys89cVxIlV6uBUY",
		Beginer: "1fh6fGJpEY1WaDwQrDKhxj82zuW2exrk4",
		Checklists: "1uZtE3jsMajXaYR-11OlhjKXvLMVXKkNP",
		DataBase: "1uLzYRuEj4WNK54gU1g_jY8VpTT70hutH",
		English: "11lwSXA776YD7poMtvA0Y8TcVlLOYGKxU",
		ErrorPrevention: "1H7AN3xG6OtrDbzvKzOJtanklznInWDrI",
		Factory: "18mlpMLm8rMo5xSLdGagCEFPCPX26lMZo",
		FileExcel: "1L8I04fNH1QICjSc0qUCAVfIhpX3yyceW",
		FilePP: "1fSWc3bB5xkoW8OcMuFGdMf6dPxOxTHcZ",
		Finance: "15FntiJdQxn4KOG28UvtpCzXE0UHkPVIx",
		Folder01: "1_WUurLj2z2FxMqUI2nPcTJTGpNH8APbp",
		Folder02: "1RLgRmw69vfmjrrwOAWc5kBIQw-TX59Dl",
		FolderControl: "1K1IGe_M-BoiFw0b3taIiHu2rUCFHjhom",
		FolderDL: "136UAvHaP5uqvuykTxAmCaFw7pkFa4_pa",
		FolderUP: "1Yf9VjA6dRoGrh2lrHYVXmE0sq8-Oafv-",
		Japanese_01: "1F1P16tQPWVWgiAu6D923pKs6Uc6kRG0L",
		Japanese_02: "1BImNARylam3wKpX18_p8FRWhph2ujSXz",
		LinkContracts: "1T-8AzjIrRWMcGKTBbwLLTbFjxSdVKKtt",
		Lists01: "1j0IjQE-YOGj3b-4lMRA1yb_zI-M6nwZJ",
		Lists02: "1xP-ltTH_UDBi-g8he42POjuhsJgFvg1i",
		Mail02: "1MGeft4Almio5zVBk8dUEOtO9hJc8PB6y",
		Management: "1jf8QtbzJc5UaypuXXHxawMj66g17gT1J",
		PCAnalizing: "1-IQT7ou_S-r5HnbPKiiTdCeDLJv1FPt0",
		PCDownload: "13DMK2TVxsxkyW5xH17tsxgn8oNpiumiN",
		PCnote: "1h6ziPe7pT7mQxvsxlsE_Fq0TGcjkYmoB",
		Prohibited: "1Idy1XgzDOjiM0p09XwegYAUkrWwQMe8I",
		RelatedContracts: "1zEcBfZD2Xt9mTVaWMsV_jNk1GBW6rYCe",
		Seminar: "1mz8GMoi_ZhlLUlF-PPhH3pymHvsHrVtJ",
		StampedContracts: "1qeIB899ONPVEiUaNQ-9VC1Qm-06WUA6f",
		Technology: "1I0-Dddy1v8jit8wYMirSYdJJKTtlO8HU",
		User02: "1yjSWBKcR-s-t7XsE6Nk-sXoR9CR8DkHE",
		User03: "1-PhbVSeY4pYVZqmZCu1cQ5doN-CjA075",
		User04: "1tFyGC105deuHI1nMWukvEZcx-b39pwxz",
		UserComment: "1XrgasMPRDzI90evXQBsFiKhpB5E5AGGs",
		UserGroup02: "11Er-SR0whAm4Uk-68v0A8BD6d72rv7xq",
		UserGroup03: "19UX9InhcMAwLVRicMQmS89Mk9Fo5DnWT",
		UserNG: "1gRl6Nj9xoh1G9SktvuA9V2mHyzIYMTlB",
		UserOK: "1nXWeWuPti-O7l62COocirDV5feUMLH-s",
		Utilization: "1Mv_ULtqHF6IhhtMEEpTUK5iCtlM2qTuP",
		Value: "1mUHgOTjAHkx-kLXgunFfpIsH4Q99p8Ep",
		Version: "1lu3w_7i7fxnT8t1UBrSa7p38PnXqOXWi",
		Vision: "14GBNk3UBgDXRcL5FQYHy-DNOVh3TivqO",
		Warehouse: "1ZVEFr-LPvzWWsntrAmMRSZrfArPLU5Nn",
		WorkIP: "1q7UZi6x1WWIR6SPy2_QhIMtMgVu7Iuih",
		WorkPatent: "1-pj1gAGskcvQVQqUShZlEivR7SpG6t6E"
	},
	PNG: {
		"AI Revise": "1TMEM08DufFchQJ9IOG4OvKDs39RGQcTE",
		AlignCenter: "1mQ_btkLIzMBgXRZ9ZICiZNhij4PvTlFU",
		AlignJustify: "1-Id_oGNglSixaknMIxmaw7vAu5wHJwYX",
		AlignLeft: "13SADI0N4pvE2xpGAE2mi1dx-84wbL7i9",
		AlignRight: "1LRyVsdZggllHcyOmGkZgKLerK1twgJhb",
		Archive: "16SbLtEdSFgjxQaMp5bliCIIY6TjdO8aX",
		ArchiveAlt: "1tRfUJrvyrhDnmRKqKCTuSA01SRcT2-dy",
		ArchiveSparkle: "1GJh8pL6CmY-IpZ_2mWRGKx9AUQ6msvwF",
		AreaSearch: "158zsvlZ-YoOPut_Z_qjBfZkxqjYSxAmE",
		ArrowRotateRight: "1VdjMGA5jTy355lYnmCFef11peQYWw6aO",
		ArrowsRotateAnimated: "1_9r_VCX_aj2NTOfTreHFDjAiYrBbtooV",
		ArrowUp: "15OfXqlHjeJxEItdBCyYRqBvbtjJXgI-X",
		Assistant: "1-DG__X1F9jbSswJHZd3W4PKUrW2lA8vu",
		BarSparkles: "1uBuC_vgmk1ncx4sm5A7tafy2u4uScNnt",
		Book: "1QBTslT4UHxN5GonKeoDkpnK12zC-Qy65",
		Books: "1bd2xjcUoOPUWrHhlvjILbL--l1Z4vWzw",
		BookSearch: "1qkmLBeglHtxsPu92FAvf1H0-x6ba63Z6",
		BookSparkle: "1YA_lMG42U_ldCDFpqwUSv990awb7i553",
		Building: "1oNgKKR5WQFkeyiAZDJs3krd7pyYcRt1u",
		Cabinet: "1LPmGmtvlqEzpjcfPVzpcRTvESZ78v1eZ",
		Calendar: "140B2VX0b1TPALUxFkWF2MPFW65n83Pt3",
		CalendarWarning: "1BaJOjcAMNmsI0_fFUsOzKe1getEY6irv",
		CalenderCheck: "1X1jO_hsPIEa3N_noxEdUazMVCdWBI2b9",
		Chart: "17gfLUIZ7ZN3SELqqhz90QnjTw1hVjhzK",
		ChartLine: "1brl4iQuJ2F_Zau-kDZIHvMT58xpfQlG3",
		CheckBook: "1tin3EREtUMg9AczpABoUuMKzJ6eMc7qo",
		CheckCircle: "1yX7l_dypa5tCKa34-3iTqrDjMdrTU_4Y",
		Clock: "1f0EE9QaHskP-WM_IlFihC-NOVK0DfvOJ",
		CloseCircle: "1itMxRjDW0TB4Ae_DKEJFhy_OoLO0dSqO",
		Comment: "1pbxP5xMQOqYkql5fhAZDRLcGg7YvkdGz",
		Comments: "1U2gNpIBjlO-05LKwjvgD2tZziIYSYyL8",
		Comparison: "1wXkPseCXuT0DinfDoXebjj6qaU2vrazN",
		DocumentCheck: "1IJZlx9w_3dxulNrn10zTvEzfekdIoDhP",
		Download: "1HF0-slZEinJCjH3rugy-qnWTS1RC6uoW",
		Earth: "1CMPa0Ans9CjpLL9_Rt9pLDzKmlR4DS9p",
		Ellipsis: "1MfoxLmdbL1Rdy00noZoVRc0Bmh4Fu-P1",
		File: "1DX3M946uqT35ap0BOwGFXBHuKQHYUKNy",
		FileCheck: "13PUeXTGOKR543sfwqVsJaaCaAsVZTfeV",
		FileEdit: "1RYiaHUp1cSZLdZEnczlkmIVWXYg1vB5_",
		FileGroup: "1PfV70u5ziDpvXQK8nDldXk-zOdFKkgaO",
		FileLines: "1u0e9HRlCRxRCUhgK8e_ESZBOLop1jFYZ",
		FileLock: "1zqkx2ADUroaZoRlCB9BxZYFbC0loTB6a",
		FilePdf: "1f59_t1vjXRTIoPfVDBme6ywJDDSMXmIK",
		Files: "1wpYl4-CaE6ryzeMe1RzHjoqIf0EM1SHk",
		FileSigned: "1ngmzIOfmoO1-ld9EPHgR7mFPQP9-k4wG",
		FilesSignature: "18jA3jLAO_-foz4XP6J1PVzcQerWJ_FAk",
		FileWarning: "12CGzBk3_0wweUSt1YOoCQLhqAUyzqHMd",
		FileWord: "1yHxTZf9fFGLnSHJ97t579FGU6ysEFfvB",
		FolderTree: "1CqpkmzjlF_uVY_s-h3Rn5h99QIK8vGhY",
		Handshake: "1tRsQfOa83kZCOgDjBynPfJF_MqTVvrCC",
		History: "12PC6L9nzr10ZGSq1ZEpnhNmV36hYINsR",
		Home: "1bCx_rHK57syjyFARSAyJRa7fecqk3N8c",
		Hourglass: "1EDLcsvkMz7fXNIAyAoAeZ7vY50nFtIIm",
		Lightbulb: "1Pe-i0UpntC4WE1nER8mas7xlVZVzpOWs",
		Link: "1HtmS0JrDH0f3OHiKJr917AV9XC6p-D0N",
		ListBulleted: "1_tkODhyii_XBn56c76h6hgWBl92i21N6",
		ListCheck: "1iAvNtnAkP-QlgXOKelSW7kqDlamfu3SC",
		Lock: "1EeTQvSR2BDvHxCBPedv68wGWo1Pl4iQS",
		MagnifyingGlass: "1yknPYm3QTfVOeCJ2KkaXr8eqy0l0egya",
		Mail: "1MCMUsKMFNDQkjvJj2bFfge7cXo9-01b9",
		Microphone: "1CYQeqjbaIO5TDtsYsX0_grmKTbTUcawO",
		Mirge: "1eJlN_60oCjTC1NDN2OGyQR2Ji-gRx00x",
		New: "1Dbf-J0ct_jJUZ8cDgwPGboM0bX20h4T7",
		NodeCircle: "1fQEqcaV9RhO0hlNRqXuhoE2AChNGhPYp",
		NodeCircleSparkle: "1p71TSZky9wxW1i7SOE2DRC0nU_yOkauL",
		NoteEdit: "1VxsSKXC4w-05Oz9L_CyHf2sfeKgW2HJ3",
		Pen: "1OvphPHVDFrsrAcfpV-vRAx41sLOxijT3",
		PlugConnect: "12hwhnc8JyQk7oLXJGrD2EV4ZuGFWZG1y",
		Question: "1D9--q_NlOgFmkcPnOQxybATx62-Xbv4-",
		QuestionCircle: "1F4xRIP_NFqjvPKalr-k-R8U9_QaXem8q",
		ScaleBalanced: "15xLl0GTGxLcmbzK9X-LTNm69tnX-1DuD",
		Send: "1d2FPiD-Y7OjJDf85gVBqAWkYxRx3Q8w_",
		Settings: "1RJQiA2V7yz2wqPrgUxanm6qww6I1iB-R",
		Split: "1YxA4Xe_ZGiEgvIDC9Pp9s5_E7fsW470h",
		Storage: "1-O8Fud2_xD_2Ueza4l7260s0gngvU6J8",
		Support: "1iY0imD_27kXccLIlp7kxOobtUJnjUSmZ",
		Table: "1Mp7maINCrhact6bIBuJ9IkRLq6hUOYca",
		Tag: "14AnGslCTCI5uZVeND9uA3KIY8HMZ0Uch",
		TextSearch: "1IIt3LKV0pYTb8XMwsPTcaV-3ToQrLf98",
		"Thumbs Up": "1e_nWdx8TmPZR1U0BuoOMH3XBM66BhfDF",
		Translate: "1LxJKs054-GRd6hwq2WpJ6bCHC3wcLa8-",
		Upload: "19ddH_3gxs6MUJPFgNGtn2HyjikBVvuTh",
		User: "1nR5o7g0toXwsOCO-D_38BF90BUtp3fvW",
		UserGroup: "1A50sjCPrqFrLGog36scea_BlIa__Fff0",
		UserQuestion: "1VLnH0BLbGpDy6ObYxBAsVpLk6naee00s",
		Wand: "1OGq3SCkgkfR9uuAxf7MnPLKWSBMDs5eR",
		WarningTriangle: "1NrHX1qINkyAeP4ZK7l-32c4XVfQBj9Je",
		"Writing Sparkles": "1YmiNEQmBZjJWZ6dcJ4_LxcTDwB4XYwiv",
		Writing: "1C73AAnD533UHr72FQU7OsWXEtPkob-HN",
		Academy01: "1TMUZ0nzsDYVJ7oSH27x5WBcOyAWE6UsT",
		Academy02: "1XxRJyb2cce68xgNfw7hxcQ7WI5A2240K",
		Beginer: "1J8M46g7l4tFSnzYdGig6yDzac9kQzGMt",
		Checklists: "1sJEb38N4rgOhLqR0NKY4V8nb9DlR-hQ-",
		DataBase: "1NdsbFFF_cIVP6OOoawc1Y6nOso2Lojpt",
		English: "1kiQbtcXJl6yA7qA4FtcQKboTi_iuAOyt",
		ErrorPrevention: "1zNDj_dqnrAt2lQPpNbkApSfa-8KBV-Pg",
		Factory: "1WoXlmvyHhceczifNIGeN4wBsnH-3KtKE",
		FileExcel: "1A0WOOzjxm8fAWU3-kwn4gQ2uvL0pyAzD",
		FilePP: "1IzIazAnWKXa9NFupidpdPxy2s-EJHfyq",
		Finance: "1dScZzmj_dllt9zJkqZd_1thvIyD1ohwI",
		Folder01: "1JfvO6gpGKPRjqzbMSUQW5F5jVjUpl0QX",
		Folder02: "16mbtxStwD_Dc4KqGVCmkdB2HgGysucsN",
		FolderControl: "1kQ59G7OI13yLaXEdmUA9cpgnBFg2NJW2",
		FolderDL: "15kWQweAmmAp-QlnTc8KHNLWNsjkUJk3B",
		FolderUP: "1azaMmqrM3jCgqC9nSylDg-maTvC5dwsl",
		Japanese_01: "1lRDRtuI0UCNpgkzWlPWwHVCPEnWW6pr8",
		Japanese_02: "1VMQ587gUkCzdQ8pVl1lqUqwtfO2XIm6p",
		LinkContracts: "1tXqQLQBLG9swmsZnS_cSNYxtHj_DezxD",
		Lists01: "1-EDGCB5r0BFo5KTkSQ-8nyR1_R0VS8Vg",
		Lists02: "1PbNrCrDb5N4Qe9lnOE0ucLILiFCzM3Aj",
		Mail02: "1-GG7C-Sc94wLtRIFl1g-3Wd6_SJLUHH8",
		Management: "1_DZlAJOXNi7Z1IH0906_8XIiy8XNVJMZ",
		PCAnalizing: "11tESoP3anfZNiSNMt0NJbw-yw9sPivm7",
		PCDownload: "1g-9x9OLnTBzDXhJEAIkMUdWfdxWcXpLb",
		PCnote: "1R0mQAXTR8lYNwqSRrvUv2brNwL0MUyJ-",
		Prohibited: "118HFCVmKFRpvv7ZkqVARU3MUu1kOMX4g",
		RelatedContracts: "1o3Zc6FFi-9k-vb5yUEC1dvUcSa3MRr-g",
		Seminar: "1K25VHilcgwFXjgxWtQ1YFKKtqdOCs7tB",
		StampedContracts: "12hQOKs5x4sDDJgV7nI0Ln0GNcDieSG7u",
		Technology: "1azP7daUY_tqsVWVsNHy3Zy-KBELiTbiR",
		User02: "1OsWCCB9F5ruqNW6-mOTSVO7hOx7OoiaS",
		User03: "1buEpAM5qCIdbhvPSRfegirxFbRIg9FIp",
		User04: "1cn29oiu0ZxGMv3r-Pm8fF-aCH1t2aXkO",
		UserComment: "1R79ZvZOdculvuz52Bg-EiSfx3hmNmu2X",
		UserGroup02: "1Fu2kczmPb7_wPL2SNt4J_28ScXPRKPBi",
		UserGroup03: "1vZLcwZQu7Fve7ZCkO4uu014IAjXC2qHV",
		UserNG: "11_ElVRvcUZWOHvao58tlBSZMvZBTrzUs",
		UserOK: "1_jrEGmBc_yIK61Nv8cXee7n38hOTBe1M",
		Utilization: "1VpJCJXHYwqHGdttTdpKhEpRJ7lT3d-lI",
		Value: "1FTFOU28BssEK5C35JDmiFsT4yx7t0xWt",
		Version: "1PMFQ5-1j8P0lbrJ0C6BB-EdXGpv2q4tI",
		Vision: "10Tb4L2vNNINCstxBECQiG54x7gcNu5Ik",
		Warehouse: "1vXvZx_b3eQj-7Fcpm2gNAwWdR8WTHhG-",
		WorkIP: "1Wz5-IMZtTaPSFa7rEPPvPm9cvBBVUUU7",
		WorkPatent: "1XoAPmpUqsVCtYD33zRJifmDfd4G-Zsl7"
	}
};
function getSharedIconDriveId(data) {
	if (data.brand !== "Shared" || data.assetType !== "アイコン") return "";
	return sharedIconDriveIds[data.fileFormat]?.[data.title] ?? "";
}
var mirrors = local_mirror_manifest_default;
var popularity = asset_popularity_default;
function enrichSearchAsset(asset) {
	const driveId = asset.driveId || getDriveFileId(asset.driveUrl) || getSharedIconDriveId(asset);
	const mirror = mirrors[asset.id];
	const matchingMirror = mirror?.mirrored && (!driveId || mirror.sourceDriveId === driveId);
	const mediaUrl = (relative) => `/${relative.replace(/^\/+/, "")}`;
	return {
		...asset,
		...driveId ? { driveId } : {},
		...!asset.thumbnailUrl && matchingMirror && mirror.thumbnailPath ? { thumbnailUrl: mediaUrl(mirror.thumbnailPath) } : {},
		...!asset.downloadUrl && !driveId && matchingMirror && mirror.downloadPath ? { downloadUrl: mediaUrl(mirror.downloadPath) } : {},
		popularity: Number(popularity[asset.id] || 0),
		displayFamily: getKnownAssetFamily({
			...asset,
			driveId
		})
	};
}
//#endregion
//#region scripts/brand-asset-catalog-view.ts
function publishedCatalog(catalog) {
	const keys = [
		"id",
		"title",
		"brand",
		"fileFormat",
		"status",
		"assetType",
		"updatedAt",
		"assetDomain",
		"publication",
		"description",
		"usage",
		"tags",
		"driveUrl",
		"driveId",
		"downloadUrl",
		"thumbnailUrl",
		"usageRights",
		"expiresAt",
		"assetGroupId",
		"color",
		"colorVariant",
		"locale",
		"variantLabel",
		"recommended",
		"thumbnailColor",
		"allowBrowseOnly"
	];
	const products = catalog.products.filter((product) => product.state === "active").map(({ id, label, state, order }) => ({
		id,
		label,
		state,
		order
	}));
	const assets = catalog.assets.filter((asset) => isPublished(asset, products)).map((asset) => Object.fromEntries(keys.filter((key) => Object.hasOwn(asset, key)).map((key) => [key, asset[key]])));
	const visible = new Set(assets.map((asset) => asset.id));
	const originals = new Map(catalog.assets.map((asset) => [asset.id, asset]));
	for (let i = 0; i < assets.length; i++) for (const key of ["replacedBy", "previousVersionId"]) {
		const value = originals.get(assets[i].id)[key];
		if (typeof value === "string" && visible.has(value)) Object.assign(assets[i], { [key]: value });
	}
	return {
		revision: catalog.revision,
		products,
		assets: assets.map(enrichSearchAsset)
	};
}
//#endregion
//#region scripts/brand-asset-cms-api.ts
function createCatalogMiddleware(root, options = {}) {
	const dir = options.dataDir || path.join(root, ".brand-asset-cms");
	const file = path.join(dir, "catalog.json");
	let queue = Promise.resolve();
	let initialization;
	const seedUpdate = "truston-drive-2026-10-09";
	const templateUpdate = "truston-potx-template-2026-11-16";
	const templateDriveId = "1ycsMOAX4bNwisqDO4DrKcJpzYiGbfFz7";
	async function readSeed() {
		return JSON.parse(await promises.readFile(options.seedPath || path.join(root, "src/pages/sandbox/brand-asset-portal/assets-index.json"), "utf8"));
	}
	async function importTrustOn(update = seedUpdate, templateOnly = false) {
		let current;
		try {
			current = JSON.parse(await promises.readFile(file, "utf8"));
		} catch (error) {
			if (error.code === "ENOENT") return;
			throw error;
		}
		if (current.appliedSeedUpdates?.includes(update)) return;
		const incoming = (await readSeed()).filter((asset) => asset.brand === "TrustOn" && (templateOnly ? asset.driveId === templateDriveId : asset.driveId !== templateDriveId));
		if (!incoming.length) return;
		const ids = new Set(current.assets.map((asset) => asset.id));
		const driveIds = new Set(current.assets.map((asset) => asset.driveId).filter(Boolean));
		const product = defaultProducts.find((item) => item.id === "TrustOn");
		if (!product) throw new Error("TrustOn product is missing");
		const next = {
			...current,
			revision: current.revision + 1,
			products: current.products.some((item) => item.id === product.id) ? current.products : [...current.products, {
				...product,
				order: Math.max(-1, ...current.products.map((p) => p.order)) + 1
			}],
			assets: [...current.assets, ...incoming.filter((asset) => !ids.has(asset.id) && !driveIds.has(asset.driveId))],
			appliedSeedUpdates: [...current.appliedSeedUpdates || [], update],
			lastChange: {
				actorId: templateOnly ? "system:truston-template-import" : "system:truston-seed-import",
				at: (/* @__PURE__ */ new Date()).toISOString()
			}
		};
		if (next.products.length > 100 || next.assets.length > 1e4 || new Set(next.products.map((p) => p.label.trim().toLowerCase())).size !== next.products.length) return false;
		validate(next);
		await promises.mkdir(path.join(dir, "history"), {
			recursive: true,
			mode: 448
		});
		await promises.writeFile(path.join(dir, "history", `${current.revision}-${randomUUID()}.json`), JSON.stringify(current), { mode: 384 });
		const temp = `${file}.${randomUUID()}.tmp`;
		await promises.writeFile(temp, JSON.stringify(next), { mode: 384 });
		await promises.rename(temp, file);
	}
	async function load() {
		initialization ||= (async () => {
			try {
				await promises.access(file);
			} catch (error) {
				if (error.code !== "ENOENT") throw error;
				const assets = await readSeed();
				const initial = {
					revision: 0,
					products: defaultProducts,
					assets,
					appliedSeedUpdates: [...assets.some((a) => a.brand === "TrustOn" && a.driveId !== templateDriveId) ? [seedUpdate] : [], ...assets.some((a) => a.driveId === templateDriveId) ? [templateUpdate] : []]
				};
				validate(initial);
				await promises.mkdir(dir, {
					recursive: true,
					mode: 448
				});
				const temp = `${file}.${randomUUID()}.tmp`;
				await promises.writeFile(temp, JSON.stringify(initial), { mode: 384 });
				await promises.rename(temp, file);
			}
			let pending = false;
			for (const templateOnly of [false, true]) try {
				if (await importTrustOn(templateOnly ? templateUpdate : seedUpdate, templateOnly) === false) pending = true;
			} catch {
				pending = true;
			}
			if (options.importsPath) {
				const batches = JSON.parse(await promises.readFile(options.importsPath, "utf8"));
				if (!Array.isArray(batches) || new Set(batches.map((batch) => batch.id)).size !== batches.length) throw new Error("Invalid catalogue imports");
				for (const batch of batches) {
					if (!/^[a-z0-9-]{1,100}$/.test(batch.id) || !Array.isArray(batch.assets)) throw new Error("Invalid catalogue import");
					const current = JSON.parse(await promises.readFile(file, "utf8"));
					if (current.appliedSeedUpdates?.includes(batch.id)) continue;
					const ids = new Set(current.assets.map((asset) => asset.id));
					const driveIds = new Set(current.assets.map((asset) => getDriveFileId(asset.driveUrl) || asset.driveId).filter(Boolean));
					const incoming = batch.assets.filter((asset) => {
						const driveId = getDriveFileId(asset.driveUrl);
						if (!driveId) throw new Error("Imported assets require a Drive file URL");
						if (ids.has(asset.id) || driveIds.has(driveId)) return false;
						ids.add(asset.id);
						driveIds.add(driveId);
						asset.driveId = driveId;
						asset.downloadUrl = getDriveDownloadLink(driveId);
						return true;
					});
					const next = {
						...current,
						revision: current.revision + 1,
						assets: [...current.assets, ...incoming],
						appliedSeedUpdates: [...current.appliedSeedUpdates || [], batch.id],
						lastChange: {
							actorId: "system:catalog-import",
							at: (/* @__PURE__ */ new Date()).toISOString()
						}
					};
					validate(next);
					await promises.mkdir(path.join(dir, "history"), {
						recursive: true,
						mode: 448
					});
					await promises.writeFile(path.join(dir, "history", `${current.revision}-${randomUUID()}.json`), JSON.stringify(current), { mode: 384 });
					const temp = `${file}.${randomUUID()}.tmp`;
					await promises.writeFile(temp, JSON.stringify(next), { mode: 384 });
					await promises.rename(temp, file);
					await pruneHistory();
				}
			}
			if (pending) initialization = void 0;
		})().catch((error) => {
			initialization = void 0;
			throw error;
		});
		await initialization;
		return JSON.parse(await promises.readFile(file, "utf8"));
	}
	async function pruneHistory() {
		try {
			const historyDir = path.join(dir, "history");
			const histories = (await promises.readdir(historyDir)).filter((name) => /^\d+-[\da-f-]+\.json$/.test(name)).sort((a, b) => Number.parseInt(b, 10) - Number.parseInt(a, 10));
			await Promise.all(histories.slice(20).map((name) => promises.unlink(path.join(historyDir, name))));
		} catch {}
	}
	function reply(res, status, body) {
		res.writeHead(status, {
			"Content-Type": "application/json",
			"Cache-Control": "no-store",
			"X-CMS-Mode": options.authorize ? "production" : "local"
		});
		res.end(JSON.stringify(body));
	}
	async function read(req) {
		const parts = [];
		let size = 0;
		for await (const chunk of req) {
			size += chunk.length;
			if (size > 8 * 1024 * 1024) throw new Error("登録データは8MB以内にしてください。");
			parts.push(Buffer.from(chunk));
		}
		return JSON.parse(Buffer.concat(parts).toString("utf8"));
	}
	function validate(data) {
		if (!Number.isInteger(data.revision) || !Array.isArray(data.products) || !Array.isArray(data.assets) || data.products.length > 100 || data.assets.length > 1e4) throw new Error("データ形式が正しくありません。");
		const ids = /* @__PURE__ */ new Set();
		const labels = /* @__PURE__ */ new Set();
		for (const p of data.products) {
			if (!p || typeof p.id !== "string" || !/^[\p{L}\p{N} _-]{1,80}$/u.test(p.id) || typeof p.label !== "string" || !p.label.trim() || p.label.length > 80 || ids.has(p.id) || labels.has(p.label.trim().toLowerCase()) || !["active", "ended"].includes(p.state) || !Number.isFinite(p.order)) throw new Error("プロダクト名の重複、空欄、状態を確認してください。");
			ids.add(p.id);
			labels.add(p.label.trim().toLowerCase());
		}
		const assetIds = /* @__PURE__ */ new Set();
		for (const a of data.assets) {
			if (!a || typeof a.id !== "string" || !a.id || assetIds.has(a.id) || typeof a.title !== "string" || !a.title.trim() || a.title.length > 300 || !ids.has(a.brand) || ![
				"current",
				"deprecated",
				"archived"
			].includes(a.status) || ![
				"PNG",
				"SVG",
				"PDF",
				"AI",
				"PSD",
				"PPT",
				"MP4",
				"JPG"
			].includes(a.fileFormat) || typeof a.assetType !== "string" || !a.assetType || !Number.isFinite(Date.parse(a.updatedAt))) throw new Error("アセットの必須項目または参照プロダクトが正しくありません。");
			assetIds.add(a.id);
			for (const key of [
				"description",
				"owner",
				"usageRights",
				"driveId",
				"expiresAt",
				"publication",
				"assetDomain"
			]) if (a[key] !== void 0 && (typeof a[key] !== "string" || a[key].length > 1e4)) throw new Error("入力項目は10000文字以内の文字列にしてください。");
			if (a.publication && !["draft", "published"].includes(a.publication)) throw new Error("公開状態が正しくありません。");
			if (a.assetDomain && !["brand", "corporate"].includes(a.assetDomain)) throw new Error("領域が正しくありません。");
			if (a.expiresAt && (!/^\d{4}-\d{2}-\d{2}$/.test(a.expiresAt) || !Number.isFinite(Date.parse(a.expiresAt)) || new Date(a.expiresAt).toISOString().slice(0, 10) !== a.expiresAt)) throw new Error("利用期限が正しくありません。");
			for (const key of ["usage", "tags"]) if (a[key] !== void 0 && (!Array.isArray(a[key]) || a[key].some((value) => typeof value !== "string"))) throw new Error("タグと用途は文字列の一覧にしてください。");
			for (const key of [
				"driveUrl",
				"downloadUrl",
				"thumbnailUrl"
			]) {
				const url = a[key];
				if (url !== void 0 && typeof url !== "string") throw new Error("リンクは文字列にしてください。");
				if (key === "thumbnailUrl" && url?.startsWith("data:") && Buffer.byteLength(url.split(",")[1] || "", "base64") > 512 * 1024) throw new Error("サムネイルは512KB以内にしてください。");
				if (url && !(key === "thumbnailUrl" && /^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(url))) {
					if (!url.startsWith("https://") || new URL(url).username || new URL(url).password) throw new Error("リンクにはHTTPSのURLを指定してください。");
				}
			}
		}
	}
	return (req, res, next = () => {}) => {
		const route = req.url?.split("?")[0];
		const search = route === "/api/brand-assets/search";
		const localSession = !options.authorize && route === "/api/auth/session";
		if (route !== "/api/brand-assets/catalog" && !search && !localSession) return next();
		const host = req.headers.host || "";
		const address = req.socket.remoteAddress || "";
		if (!options.authorize && (!/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host) || ![
			"127.0.0.1",
			"::1",
			"::ffff:127.0.0.1"
		].includes(address))) return reply(res, 403, { error: "ローカル管理APIはlocalhostからのみ利用できます。" });
		const expectedOrigin = options.publicOrigin || `http://${host}`;
		if (req.headers.origin && req.headers.origin !== expectedOrigin || options.authorize && req.method === "PUT" && req.headers.origin !== expectedOrigin) return reply(res, 403, { error: "アクセス元が一致しません。" });
		if (localSession) return reply(res, req.method === "GET" ? 200 : 405, {
			mode: "local",
			authenticated: false
		});
		if (search && req.method !== "GET") return reply(res, 405, { error: "閲覧専用APIです。" });
		const publicRead = search && options.publicSearch === true;
		const actorId = (publicRead ? void 0 : search ? options.authorizeRead || options.authorize : options.authorize)?.(req, res);
		if (options.authorize && !publicRead && !actorId) return;
		if (req.method === "GET") {
			queue = queue.then(() => load().then((data) => reply(res, 200, search ? publishedCatalog(data) : data)).catch(() => reply(res, 500, { error: "保存データを読み込めません。" })));
			return;
		}
		if (req.method !== "PUT") return reply(res, 405, { error: "対応していない操作です。" });
		if (!req.headers["content-type"]?.startsWith("application/json")) return reply(res, 415, { error: "JSON形式が必要です。" });
		queue = queue.then(async () => {
			try {
				const data = await read(req);
				const deletedAssetIds = data.deletedAssetIds ?? [];
				delete data.deletedAssetIds;
				if (!Array.isArray(deletedAssetIds) || deletedAssetIds.some((id) => typeof id !== "string") || new Set(deletedAssetIds).size !== deletedAssetIds.length) throw new Error("削除対象が正しくありません。");
				validate(data);
				const current = await load();
				data.appliedSeedUpdates = current.appliedSeedUpdates;
				if (current.revision !== data.revision) return reply(res, 409, { error: "他の利用者が更新しました。再読み込みしてから保存してください。" });
				if (current.products.some((p) => !data.products.some((n) => n.id === p.id))) throw new Error("プロダクトは削除せず終了状態に変更してください。");
				const removedIds = current.assets.filter((a) => !data.assets.some((n) => n.id === a.id)).map((a) => a.id);
				if (removedIds.length !== deletedAssetIds.length || removedIds.some((id) => !deletedAssetIds.includes(id))) throw new Error("削除対象を明示してください。再読み込みしてから削除してください。");
				const existingAssets = new Map(current.assets.map((a) => [a.id, a]));
				for (const asset of data.assets) {
					if (isDeepStrictEqual(existingAssets.get(asset.id), asset)) continue;
					const driveId = getDriveFileId(asset.driveUrl);
					if (!driveId) throw new Error("Google Driveのファイルリンクが必須です。フォルダーや他サイトのリンクは登録できません。");
					asset.driveUrl = asset.driveUrl?.trim();
					asset.driveId = driveId;
					asset.downloadUrl = getDriveDownloadLink(driveId);
				}
				data.revision += 1;
				if (actorId) data.lastChange = {
					actorId,
					at: (/* @__PURE__ */ new Date()).toISOString()
				};
				else delete data.lastChange;
				await promises.mkdir(path.join(dir, "history"), {
					recursive: true,
					mode: 448
				});
				await promises.writeFile(path.join(dir, "history", `${current.revision}-${randomUUID()}.json`), JSON.stringify(current), { mode: 384 });
				const temp = `${file}.${randomUUID()}.tmp`;
				await promises.writeFile(temp, JSON.stringify(data), { mode: 384 });
				await promises.rename(temp, file);
				try {
					const historyDir = path.join(dir, "history");
					const histories = (await promises.readdir(historyDir)).filter((name) => /^\d+-[\da-f-]+\.json$/.test(name)).sort((a, b) => Number.parseInt(b, 10) - Number.parseInt(a, 10));
					await Promise.all(histories.slice(20).map((name) => promises.unlink(path.join(historyDir, name))));
				} catch {}
				reply(res, 200, data);
			} catch (error) {
				reply(res, 400, { error: error instanceof Error ? error.message : "保存できません。" });
			}
		}).catch(() => reply(res, 500, { error: "保存に失敗しました。" }));
	};
}
//#endregion
//#region scripts/brand-asset-google-auth.ts
var sessionName = "__Host-brand_cms_session";
var flowName = "__Host-brand_cms_flow";
var fresh = () => randomBytes(32).toString("base64url");
var digest = (value) => createHash("sha256").update(value).digest("base64url");
function equal(a, b) {
	if (!a || !b || a.length > 256 || b.length > 256) return false;
	const left = Buffer.from(a), right = Buffer.from(b);
	return left.length === right.length && timingSafeEqual(left, right);
}
function cookie(req, name) {
	return req.headers.cookie?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
}
function setCookie(res, name, value, age) {
	const existing = res.getHeader("Set-Cookie");
	const all = Array.isArray(existing) ? existing : existing ? [String(existing)] : [];
	res.setHeader("Set-Cookie", [...all, `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`]);
}
function json(res, status, data) {
	res.writeHead(status, {
		"Content-Type": "application/json",
		"Cache-Control": "no-store"
	});
	res.end(JSON.stringify(data));
}
function requireCompanyAccount(payload, config, nonce) {
	if (!payload.sub || !payload.email || payload.email_verified !== true || !payload.hd || !config.domains.includes(payload.hd.toLowerCase()) || !config.domains.includes(payload.email.split("@")[1]?.toLowerCase()) || !equal(payload.nonce, nonce) || payload.aud !== config.clientId || !["accounts.google.com", "https://accounts.google.com"].includes(payload.iss) || !Number.isFinite(payload.exp) || payload.exp * 1e3 <= Date.now()) throw new Error("Company account verification failed");
	return {
		actorId: payload.sub,
		email: payload.email
	};
}
function googleProvider(config) {
	const client = new OAuth2Client({
		clientId: config.clientId,
		clientSecret: config.clientSecret,
		redirectUri: `${config.origin}/api/auth/google/callback`
	});
	return {
		authorizationUrl: (state, nonce, challenge) => client.generateAuthUrl({
			scope: ["openid", "email"],
			access_type: "online",
			prompt: "select_account",
			hd: config.domains[0],
			state,
			nonce,
			code_challenge: challenge,
			code_challenge_method: CodeChallengeMethod.S256
		}),
		async exchangeAndVerify(code, verifier) {
			const { tokens } = await client.getToken({
				code,
				codeVerifier: verifier
			});
			if (!tokens.id_token) throw new Error("No ID token");
			const payload = (await client.verifyIdToken({
				idToken: tokens.id_token,
				audience: config.clientId
			})).getPayload();
			if (!payload) throw new Error("No verified identity");
			return payload;
		}
	};
}
function createGoogleAuth(config, provider = googleProvider(config)) {
	const flows = /* @__PURE__ */ new Map();
	const sessions = /* @__PURE__ */ new Map();
	function clean() {
		for (const [id, flow] of flows) if (flow.expires < Date.now()) flows.delete(id);
		for (const [id, session] of sessions) if (session.expires < Date.now()) sessions.delete(id);
	}
	function session(req) {
		clean();
		const id = cookie(req, sessionName);
		return id && id.length < 128 ? sessions.get(digest(id)) : void 0;
	}
	function authorize(req, res) {
		const user = session(req);
		if (!user) {
			json(res, 401, { error: "会社のGoogleアカウントでログインしてください。" });
			return null;
		}
		if (req.method !== "GET" && (req.headers.origin !== config.origin || !equal(req.headers["x-csrf-token"], user.csrfToken))) {
			json(res, 403, { error: "ログイン状態を更新してから操作してください。" });
			return null;
		}
		return user.actorId;
	}
	function canEdit(user) {
		return Boolean(user && config.editorEmails?.some((email) => email.trim().toLowerCase() === user.email.toLowerCase()));
	}
	function authorizeCatalog(req, res) {
		const actorId = authorize(req, res);
		if (!actorId) return null;
		if (!canEdit(session(req))) {
			json(res, 403, { error: "CMSの変更権限がありません。管理担当者に連絡してください。" });
			return null;
		}
		return actorId;
	}
	async function handle(req, res) {
		const url = new URL(req.url || "/", config.origin);
		if (!url.pathname.startsWith("/api/auth/")) return false;
		res.setHeader("Cache-Control", "no-store");
		res.setHeader("Referrer-Policy", "no-referrer");
		clean();
		if (url.pathname === "/api/auth/session" && req.method === "GET") {
			const user = session(req);
			json(res, 200, {
				mode: "production",
				authenticated: Boolean(user),
				canEdit: canEdit(user),
				email: user?.email,
				csrfToken: user?.csrfToken
			});
			return true;
		}
		if (url.pathname === "/api/auth/google/start" && req.method === "GET") {
			if (flows.size >= 1e3 || sessions.size >= 1e4) {
				json(res, 429, { error: "しばらく待って再試行してください。" });
				return true;
			}
			const old = cookie(req, flowName);
			if (old) flows.delete(old);
			const state = fresh(), nonce = fresh(), verifier = fresh();
			flows.set(state, {
				nonce,
				verifier,
				expires: Date.now() + 600 * 1e3
			});
			setCookie(res, flowName, state, 600);
			res.writeHead(302, { Location: provider.authorizationUrl(state, nonce, digest(verifier)) });
			res.end();
			return true;
		}
		if (url.pathname === "/api/auth/google/callback" && req.method === "GET") {
			const state = url.searchParams.get("state") || "";
			const browserState = cookie(req, flowName);
			const flow = flows.get(state);
			if (!flow || !equal(browserState, state) || flow.expires <= Date.now()) {
				json(res, 400, { error: "ログイン確認が期限切れです。もう一度ログインしてください。" });
				return true;
			}
			flows.delete(state);
			setCookie(res, flowName, "", 0);
			try {
				const code = url.searchParams.get("code");
				if (!code || code.length > 4096 || url.searchParams.has("error")) throw new Error("No authorization code");
				const verifiedPayload = await provider.exchangeAndVerify(code, flow.verifier);
				const employee = requireCompanyAccount(verifiedPayload, config, flow.nonce);
				const oldId = cookie(req, sessionName);
				if (oldId) sessions.delete(digest(oldId));
				const id = fresh();
				sessions.set(digest(id), {
					...employee,
					csrfToken: fresh(),
					expires: Math.min(verifiedPayload.exp * 1e3, Date.now() + 3600 * 1e3)
				});
				setCookie(res, sessionName, id, 3600);
				res.writeHead(302, { Location: "/brand-asset-portal/index.html" });
				res.end();
			} catch {
				json(res, 403, { error: "会社アカウントを確認できませんでした。会社のGoogleアカウントで再度ログインしてください。" });
			}
			return true;
		}
		if (url.pathname === "/api/auth/logout" && req.method === "POST") {
			if (!authorize(req, res)) return true;
			const id = cookie(req, sessionName);
			if (id) sessions.delete(digest(id));
			setCookie(res, sessionName, "", 0);
			json(res, 200, { ok: true });
			return true;
		}
		json(res, 404, { error: "認証操作が見つかりません。" });
		return true;
	}
	return {
		handle,
		authorize: authorizeCatalog,
		authorizeEmployee: authorize,
		hasSession: (req) => Boolean(session(req))
	};
}
//#endregion
//#region scripts/brand-asset-production-config.ts
function readProductionConfig(env) {
	const origin = new URL(env.CMS_PUBLIC_ORIGIN || "https://brand-assets-portal.ontechnologies.tech");
	if (origin.protocol !== "https:" || origin.pathname !== "/" || origin.username || origin.password || origin.search || origin.hash) throw new Error("CMS_PUBLIC_ORIGIN must be an HTTPS origin");
	const clientId = env.GOOGLE_OAUTH_CLIENT_ID;
	const clientSecret = env.GOOGLE_OAUTH_CLIENT_SECRET;
	const domains = (env.GOOGLE_ALLOWED_DOMAINS || "legalontech.jp").split(",").map((d) => d.trim().toLowerCase());
	const editorEmails = [...new Set((env.CMS_EDITOR_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean))];
	if (editorEmails.some((email) => !/^[^\s@,]+@[^\s@,]+$/.test(email) || !domains.includes(email.split("@")[1]))) throw new Error("CMS_EDITOR_EMAILS must contain company email addresses");
	if (!clientId || !clientSecret || !env.CMS_DATA_DIR) throw new Error("Configure Google OAuth and a persistent CMS_DATA_DIR before startup");
	if (!path.isAbsolute(env.CMS_DATA_DIR) || domains.some((d) => !/^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/.test(d))) throw new Error("Invalid CMS data directory or company domains");
	if (env.RAILWAY_ENVIRONMENT_ID && (!env.RAILWAY_VOLUME_MOUNT_PATH || !(path.resolve(env.CMS_DATA_DIR) === path.resolve(env.RAILWAY_VOLUME_MOUNT_PATH) || path.resolve(env.CMS_DATA_DIR).startsWith(`${path.resolve(env.RAILWAY_VOLUME_MOUNT_PATH)}${path.sep}`)))) throw new Error("Railway requires a persistent volume for CMS_DATA_DIR");
	return {
		origin: origin.origin,
		clientId,
		clientSecret,
		domains,
		editorEmails,
		dataDir: env.CMS_DATA_DIR
	};
}
//#endregion
//#region scripts/brand-asset-production-server.ts
var types = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript",
	".css": "text/css",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".woff": "font/woff",
	".woff2": "font/woff2",
	".ico": "image/x-icon"
};
function createProductionServer(config, staticDir, seedPath, provider) {
	let tomoniPolicy;
	let scripts;
	function currentScripts() {
		scripts ||= Promise.all(["login", "index"].map(async (entry) => {
			const html = await promises.readFile(path.join(staticDir, `brand-asset-portal/${entry}.html`), "utf8");
			return new Set([...html.matchAll(/(?:src|href)="((?:\.\.\/|\/)assets\/[^"?]+\.js)"/g)].map((match) => new URL(match[1], "https://portal.invalid/brand-asset-portal/index.html").pathname));
		}));
		return scripts;
	}
	function getTomoniPolicy() {
		tomoniPolicy ||= promises.readFile(path.join(staticDir, "tomoni-ai-html/index.html"), "utf8").then((html) => {
			return `default-src 'none'; script-src ${[...html.replace(/\r\n?/g, "\n").matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)].map((match) => `'sha256-${createHash("sha256").update(match[1] || "").digest("base64")}'`).join(" ")}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'`;
		});
		return tomoniPolicy;
	}
	if (path.resolve(config.dataDir).startsWith(`${path.resolve(staticDir)}${path.sep}`) || path.resolve(config.dataDir) === path.resolve(staticDir)) throw new Error("CMS data must be outside the public directory");
	const auth = createGoogleAuth(config, provider);
	const thumbnail = createDriveThumbnailHandler(auth.authorizeEmployee);
	const catalog = createCatalogMiddleware(staticDir, {
		dataDir: config.dataDir,
		seedPath,
		importsPath: path.join(path.dirname(seedPath), "cms-imports.json"),
		publicOrigin: config.origin,
		authorize: auth.authorize,
		publicSearch: true
	});
	return createServer((req, res) => {
		res.setHeader("X-Content-Type-Options", "nosniff");
		res.setHeader("Referrer-Policy", "no-referrer");
		res.setHeader("X-Frame-Options", "DENY");
		res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' https://accounts.google.com https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://accounts.google.com https://www.googleapis.com https://oauth2.googleapis.com; frame-src https://accounts.google.com https://drive.google.com https://docs.google.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
		(async () => {
			const pathname = new URL(req.url || "/", config.origin).pathname;
			if (pathname === "/health" && req.method === "GET") {
				res.writeHead(200);
				res.end("ok");
				return;
			}
			if (await auth.handle(req, res)) return;
			if (pathname.startsWith("/api/brand-assets/thumbnail/")) {
				await thumbnail(req, res, pathname.slice(28));
				return;
			}
			if (pathname === "/api/brand-assets/catalog" || pathname === "/api/brand-assets/search") {
				catalog(req, res);
				return;
			}
			if (pathname.startsWith("/api/")) {
				res.writeHead(404);
				res.end();
				return;
			}
			if (req.method !== "GET" && req.method !== "HEAD") {
				res.writeHead(405);
				res.end();
				return;
			}
			const route = decodeURIComponent(pathname === "/" || pathname === "/index.html" ? "/brand-asset-portal/index.html" : pathname === "/tomoni-ai-html/" || pathname === "/tomoni-ai-html" ? "/tomoni-ai-html/index.html" : pathname);
			const tomoniPage = route === "/tomoni-ai-html/index.html";
			if (/^\/assets\/.*\.(?:js|mjs|json|map)$/i.test(route)) {
				const [loginScripts, portalScripts] = await currentScripts();
				if (!loginScripts.has(route) && !portalScripts.has(route)) {
					res.writeHead(404, { "Cache-Control": "no-store" });
					res.end();
					return;
				}
			}
			const tomoniLicense = /^\/tomoni-ai-html\/licenses\/(?:BebasNeue-OFL\.txt|MPLUS1p-OFL\.txt|README\.md)$/.test(route);
			if (!(tomoniPage || tomoniLicense || route === "/brand-asset-portal/index.html" || route === "/brand-asset-portal/login.html" || route === "/index.html" || /^\/(assets|brand-asset-portal-media)\//.test(route)) || route.split("/").some((part) => part.startsWith(".") || part.includes("\\"))) {
				res.writeHead(404);
				res.end();
				return;
			}
			const file = path.resolve(staticDir, `.${route}`);
			const realFile = await promises.realpath(file);
			const realRoot = await promises.realpath(staticDir);
			if (!realFile.startsWith(`${realRoot}${path.sep}`)) {
				res.writeHead(404);
				res.end();
				return;
			}
			const stat = await promises.stat(realFile);
			if (!stat.isFile()) {
				res.writeHead(404);
				res.end();
				return;
			}
			const ext = path.extname(file);
			if (tomoniPage) res.setHeader("Content-Security-Policy", await getTomoniPolicy());
			res.writeHead(200, {
				"Content-Type": tomoniLicense ? "text/plain; charset=utf-8" : types[ext] || "application/octet-stream",
				"Content-Length": stat.size,
				"Cache-Control": ext === ".html" ? "no-store" : "public, max-age=3600"
			});
			if (req.method === "HEAD") {
				res.end();
				return;
			}
			createReadStream(realFile).on("error", () => res.destroy()).pipe(res);
		})().catch(() => {
			if (!res.headersSent) res.writeHead(404);
			res.end();
		});
	});
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	const config = readProductionConfig(process.env);
	const staticDir = process.env.CMS_STATIC_DIR || path.resolve("public");
	const seedPath = process.env.CMS_SEED_PATH || path.resolve("cms-seed.json");
	await promises.mkdir(config.dataDir, {
		recursive: true,
		mode: 448
	});
	await promises.access(config.dataDir, promises.constants.W_OK);
	await promises.access(seedPath);
	createProductionServer(config, staticDir, seedPath).listen(Number(process.env.PORT || 3e3), "0.0.0.0");
}
//#endregion
export { createProductionServer, readProductionConfig };
