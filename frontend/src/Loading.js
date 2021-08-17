import './assets/loading.css'

export function LoadingRectangles() {
    return (<div className="lds-facebook"><div></div><div></div><div></div></div>)
}
export function LoadingCircles({ color }) {
    return (<div className="lds-ring">
        <div style={{ borderColor: color }}></div><div></div><div></div><div></div>
    </div>)
}

export const Loading = ({ color }) => {
    return (
        <div className="loadinBackground fullscreen">
            <LoadingCircles color={color} />
        </div>
    )
}