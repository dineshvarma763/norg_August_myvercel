import { NextRequest, NextResponse } from 'next/server';
import { getCookies,setCookie } from 'cookies-next';

export async function middleware(req: NextRequest) {
    const host = req.headers.get('host')
    const referrer = req.headers.get('referer')
    const path = req.nextUrl.pathname
    const newdomain = process.env.ATA_WEBSITE_DOMAIN || 'ata-git-production-conversion-digital.vercel.app'
   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; 
    //const baseUrl = 'norg-cookie-july-lfk9-5ro7ldl6v-dineshvarmas-projects.vercel.app';
    var redirectUrl =  ''
    const ip = req.ip || req.headers.get('x-forwarded-for')
    let mostVisitedPage = '';
    let sanitised_path = '';
    // Set the initial userActivity cookie if it doesn't exist
    const cookies = getCookies({ req });
    const gaCookie = cookies._ga;
    const gaValue = gaCookie ? gaCookie : '';
    const excludedExtensions = ['.css', '.png', '.json'];
    const lastTrackedPage = cookies.lastTrackedPage || '';
    const lastTrackedTime = cookies.lastTrackedTime ? parseInt(cookies.lastTrackedTime, 10) : 0;
    const currentTime = Date.now();
    
   
    const res = NextResponse.next()
    if (path === '/403') {
	return res
    }

    const isProduction = (process.env.IS_PRODUCTION && process.env.IS_PRODUCTION === 'true') || false;

    if (path.startsWith('/api')) {
	const origin = req.headers.get("origin")
	// console.log("Request Headers: ", JSON.stringify(req.headers))

	const allowedOrigins = process.env.ACCESS_CONTROL_ALLOW_ORIGIN ?
	    process.env.ACCESS_CONTROL_ALLOW_ORIGIN : 'localhost'

	res.headers.append('Access-Control-Allow-Origin', allowedOrigins)
	if (allowedOrigins.includes(origin)) {
	    res.headers.append('Access-Control-Allow-Origin', allowedOrigins)
	}

	// add the CORS headers to the response
	res.headers.append('Access-Control-Allow-Credentials', process.env.ACCESS_CONTROL_ALLOW_CREDENTIALS)
	res.headers.append('Access-Control-Allow-Methods', process.env.ACCESS_CONTROL_ALLOW_METHODS)
	res.headers.append('Access-Control-Allow-Headers', process.env.ACCESS_CONTROL_ALLOW_HEADERS)
    } else if (path.startsWith('/library') && isProduction) {
	return NextResponse.redirect(new URL("/403", req.url));
    }

    const isIPFiltered = (process.env.IS_IP_FILTERED && process.env.IS_IP_FILTERED === 'true') || false;
    if (!isIPAllowed(ip) && isIPFiltered === true) {
	return NextResponse.redirect(new URL("/403", req.url));
    }

   

    if (!path.startsWith('/_next') && !excludedExtensions.some(ext => path.endsWith(ext)) && path !== '/favicon.ico') {
        sanitised_path = path;
        console.log("Path",path , "lastTrackedPage",lastTrackedPage , "time" , currentTime - lastTrackedTime  )
        const trackPageVisit = !lastTrackedPage || (lastTrackedPage !== sanitised_path && currentTime - lastTrackedTime > 500); // Adjust the time gap as needed (here it's set to 1 second)
        if (gaValue && trackPageVisit) {
            if (!path.includes('/domain-token')) {
                const data = await insertUserPageVisit(gaValue, sanitised_path, baseUrl);
                
                if (data) {
                  const { mostVisitedPage, pageVisitedCount } = data;            
                  console.log("Most Visited pages:", mostVisitedPage);                  
                  setCookie('mostVisitedPage', mostVisitedPage, { req, res });
                  setCookie('mostVisitedPageCount', pageVisitedCount, { req, res });
                  setCookie('lastTrackedPage', sanitised_path, { req, res, maxAge: 30 });
                  setCookie('lastTrackedTime', currentTime.toString(), { req, res });
                }
            }
        }
        // Prevent endless redirection loop by checking current path
        if (path === '/') {
            if (mostVisitedPage) {
                if (mostVisitedPage.startsWith('/p')) {
                    return NextResponse.redirect(new URL('/testMarketing', req.url));
                } else if (mostVisitedPage.startsWith('/c')) {
                    return NextResponse.redirect(new URL('/testUserprofile', req.url));
                }
            }
        }
    }

    switch(host) {
	case 'ata-america.com':
	    redirectUrl = `https://${newdomain}${path}`;
	    return NextResponse.redirect(redirectUrl);
	default:
	    return res;
    }
}

function isIPAllowed(ip) {
    // Read whitelist from environment variable and split into array
    const varName = 'ALLOWED_IPS'
    if (process.env[varName]) {
	const allowedIps = process.env[varName].split(',').map(ipAddr => ipAddr.trim());
	return allowedIps.includes(ip);
    }
    return true;
}

async function insertUserPageVisit(gaValue, sanitised_path, baseUrl) {
    try {      
        console.log("BaseUrl", baseUrl)
        const response = await fetch(`${baseUrl}/api/trackActivity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gaValue, sanitised_path }),
        });
        const data = await response.json();        
        return data;
    } catch (error) {
        console.error('Error calling trackActivity API:', error);
    }
}

export const config = {
    matcher: '/:path*',
};
