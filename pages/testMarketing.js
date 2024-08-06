export default function Marketing({ message }) {
    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>{message}</h1>
        </div>
    );
}

export function getServerSideProps() {
    return {
        props: {
            message: "Welcome to the Marketing Page. You are being redirected here based on your recent activity on the site.",
        },
    };
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        fontSize: '2rem',
        color: '#333',
        textAlign: 'center',
        maxWidth: '600px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        borderRadius: '10px',
    },
};
