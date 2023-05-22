import "./home.scss";
import Stories from "../../components/stories/Stories";
import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";

function Home() {
  return (
    <div className="home">
        <Share />
        <Stories />
        <Posts />
    </div>
  );
}

export default Home;
