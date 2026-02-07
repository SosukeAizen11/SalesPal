# Social Engagement Dashboard Walkthrough

## 🚀 Overview
The **Unified Social Engagement Dashboard** provides a centralized control center for managing interactions across all your connected social platforms (Facebook, Instagram, LinkedIn, Twitter). Instead of jumping between apps, you can view metrics and reply to growing communities from one professional interface.

---

## 📍 How to Access
1. Navigate to the **Marketing** section in the main app navigation.
2. Click on the **Social** tab in the sub-navigation.
3. In the Social Sidebar (left side), locate the tabs at the top: `Drafts | Scheduled | Sent | Engage`.
4. Click the **Engage** tab.

---

## 🖥️ Dashboard Tour

### 1. Left Panel: Engagement Feed
The left side of the screen displays a feed of all your **Published** posts.

*   **Platform Indicators**: Each card shows small icons (FB, Insta, LinkedIn) indicating where the post is live.
*   **Quick Metrics**: At a glance, see the total Likes 👍, Comments 💬, and Shares 🔗 for every post.
*   **Activity Badges**: Look for the pulsing **"3 new"** red badge on cards that have recent, unread activity.
*   **Content Preview**: A snippet of the post text and a thumbnail icon allows for easy identification.

### 2. Right Panel: Interaction Hub
Clicking any post in the feed opens the detailed **Interaction Hub** on the right.

*   **Detailed Analytics**: A top banner breaks down performance:
    *   **Total Reach**: How many unique eyes saw the content.
    *   **Reaction Count**: Total likes/reactions.
    *   **Share Count**: Virality metric.
*   **Comment Stream**: A threaded view of all comments received on that post.
    *   **Author Details**: See the name and role of the commenter.
    *   **Timestamps**: When the engagement happened.
*   **Reply Functionality**:
    *   Click **"Reply"** on any comment.
    *   A rich text input box appears inline.
    *   Type your response and hit the **Send** button to post a reply (mocked).
    *   The interface mimics a real-time chat experience for quick community management.

---

## 🛠️ User Workflow Example

**Scenario**: You just launched a new product announcement yesterday.

1.  **Check Status**: You open the **Engage** tab to see how it's performing.
2.  **Identify**: You see your product post at the top of the list with a red **"5 new"** badge.
3.  **Analyze**: You click the post. The right panel reveals you've hit 15,000 Reach!
4.  **Engage**: You see a question from "David Chen" about pricing.
5.  **Respond**: You click "Reply", type *"Hi David, plans start at $29/mo!"*, and hit Send.
6.  **Done**: You move to the next post.

---

## 🏗️ Technical Implementation

### Components Created
*   **`SocialEngagementDashboard.jsx`**: The core component managing the master-detail layout, mock data generation, and internal state for replies.
*   **`SocialSidebar.jsx`**: Updated to support the new 'Engage' navigation mode and switch visual contexts.
*   **`Social.jsx`**: Orchestrates the view switching between the Content Editor (Drafts/Schedule) and the Engagement Dashboard.

### Key Logic
*   **Conditional Rendering**: The main layout dynamically swaps the 3-column Editor view for the 2-column Dashboard view when `activeTab === 'engagement'`.
*   **Data Filtration**: The dashboard automatically pulls only `status: 'published'` posts from the global marketing state.
*   **Mock Data Engine**: Includes a deterministic mock data generator (using `useMemo`) to populate metrics and comments for demonstration purposes.

---

## ✨ Design Philosophy
*   **"One Place"**: Aggregates disconnected platform data into a single stream.
*   **SaaS Aesthetic**: Uses clean lines, whitespace, and familiar social interaction patterns (like threaded comments).
*   **Immediate Feedback**: Hover states and active styling give the app a responsive, native application feel.
