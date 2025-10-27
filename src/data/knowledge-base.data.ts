import { KnowledgeBaseArticle, KnowledgeBaseCategory } from '../models';

const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();

export const mockKnowledgeBaseCategories: KnowledgeBaseCategory[] = [
    { id: 'accounts', name: 'Account Management', description: 'Help with logging in, managing users, and profile settings.' },
    { id: 'billing', name: 'Billing & Subscriptions', description: 'Everything about invoices, payments, and plans.' },
    { id: 'getting-started', name: 'Getting Started', description: 'Guides for new users to get up and running.' },
    { id: 'api', name: 'API & Integrations', description: 'Technical documentation for developers.' },
    { id: 'troubleshooting', name: 'Troubleshooting', description: 'Solutions for common technical problems.' },
];

export const mockKnowledgeBaseArticles: KnowledgeBaseArticle[] = [
    { id: 1, title: 'How to Reset Your Password', content: 'To reset your password, go to the login page and click the "Forgot Password" link. You will receive an email with instructions to create a new password. If you do not receive the email, please check your spam folder.', category: 'accounts', tags: ['password', 'login', 'account'], createdAt: daysAgo(30), updatedAt: daysAgo(5), author: 'Support Specialist', views: 152, upvotes: 45, downvotes: 2 },
    { id: 2, title: 'Understanding Your Invoice', content: 'This guide explains the common line items you will find on your monthly invoice. The "Service Overage Fee" is applied when your usage exceeds the limits of your current plan. You can monitor your usage from the dashboard.', category: 'billing', tags: ['invoice', 'billing', 'payment'], createdAt: daysAgo(60), updatedAt: daysAgo(10), author: 'Billing Expert', views: 280, upvotes: 80, downvotes: 1 },
    { id: 3, title: 'Getting Started: Creating Your First Ticket', content: 'Welcome to BoldDesk! The easiest way to create a ticket is by clicking the "New Ticket" button in the top right corner. Fill out the form and one of our agents will get back to you shortly.', category: 'getting-started', tags: ['new user', 'tickets', 'guide'], createdAt: daysAgo(90), updatedAt: daysAgo(1), author: 'Super Agent', views: 550, upvotes: 210, downvotes: 5 },
    { id: 4, title: 'Using the BoldDesk API for Ticket Creation', content: 'You can create tickets programmatically by sending a POST request to our API endpoint at `/api/v1/tickets`. Ensure you include your API key in the `Authorization` header as a Bearer token.', category: 'api', tags: ['api', 'developer', 'tickets'], createdAt: daysAgo(25), updatedAt: daysAgo(15), author: 'Tier 2 Engineer', views: 95, upvotes: 30, downvotes: 0 },
    { id: 5, title: 'Troubleshooting Common Login Issues', content: 'If you are unable to log in, first ensure that your Caps Lock key is not active. Try clearing your browser cache and cookies. If the issue persists, contact support with the error message you are receiving.', category: 'troubleshooting', tags: ['login', 'error', 'tech-support'], createdAt: daysAgo(40), updatedAt: daysAgo(20), author: 'Support Specialist', views: 310, upvotes: 115, downvotes: 12 },
];
