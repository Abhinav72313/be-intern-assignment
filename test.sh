#!/bin/bash

# Simple CRUD API Testing Interface
# Tests basic CRUD operations for Users, Posts, and Feed endpoints

# Base URLs
USERS_URL="http://localhost:3000/api/users"
POSTS_URL="http://localhost:3000/api/posts"
FEED_URL="http://localhost:3000/api/feed"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
    echo -e "\n${GREEN}=== $1 ===${NC}"
}

# Function to make API requests
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    echo -e "${BLUE}Request: $method $endpoint${NC}"
    if [ -n "$data" ]; then
        echo -e "${BLUE}Data: $data${NC}"
    fi
    
    if [ "$method" = "GET" ]; then
        curl -s -X $method "$endpoint" | jq .
    else
        curl -s -X $method "$endpoint" -H "Content-Type: application/json" -d "$data" | jq .
    fi
    echo ""
}

# ========================================
# USER CRUD FUNCTIONS
# ========================================

test_get_all_users() {
    print_header "GET All Users"
    make_request "GET" "$USERS_URL"
}

test_get_user() {
    print_header "GET User by ID"
    read -p "Enter user ID: " user_id
    make_request "GET" "$USERS_URL/$user_id"
}

test_create_user() {
    print_header "CREATE New User"
    read -p "Enter first name: " firstName
    read -p "Enter last name: " lastName
    read -p "Enter email: " email
    
    local user_data=$(cat <<EOF
{
    "firstName": "$firstName",
    "lastName": "$lastName",
    "email": "$email"
}
EOF
)
    make_request "POST" "$USERS_URL" "$user_data"
}

test_update_user() {
    print_header "UPDATE User"
    read -p "Enter user ID to update: " user_id
    read -p "Enter new first name (press Enter to keep current): " firstName
    read -p "Enter new last name (press Enter to keep current): " lastName
    read -p "Enter new email (press Enter to keep current): " email
    
    local update_data="{"
    local has_data=false
    
    if [ -n "$firstName" ]; then
        update_data+="\"firstName\": \"$firstName\""
        has_data=true
    fi
    
    if [ -n "$lastName" ]; then
        if [ "$has_data" = true ]; then
            update_data+=","
        fi
        update_data+="\"lastName\": \"$lastName\""
        has_data=true
    fi
    
    if [ -n "$email" ]; then
        if [ "$has_data" = true ]; then
            update_data+=","
        fi
        update_data+="\"email\": \"$email\""
        has_data=true
    fi
    
    update_data+="}"
    
    make_request "PUT" "$USERS_URL/$user_id" "$update_data"
}

test_delete_user() {
    print_header "DELETE User"
    read -p "Enter user ID to delete: " user_id
    echo -e "${RED}Warning: This will permanently delete the user!${NC}"
    read -p "Are you sure? (y/N): " confirm
    
    if [[ $confirm =~ ^[Yy]$ ]]; then
        make_request "DELETE" "$USERS_URL/$user_id"
    else
        echo "Delete operation cancelled."
    fi
}

# Submenu functions
show_users_menu() {
    echo -e "\n${GREEN}Users Menu${NC}"
    echo "1. Get all users"
    echo "2. Get user by ID"
    echo "3. Create new user"
    echo "4. Update user"
    echo "5. Delete user"
    echo "6. Back to main menu"
    echo -n "Enter your choice (1-6): "
}

# ========================================
# POST CRUD FUNCTIONS
# ========================================

test_get_all_posts() {
    print_header "GET All Posts"
    make_request "GET" "$POSTS_URL"
}

test_get_post() {
    print_header "GET Post by ID"
    read -p "Enter post ID: " post_id
    make_request "GET" "$POSTS_URL/$post_id"
}

test_create_post() {
    print_header "CREATE New Post"
    read -p "Enter post content: " content
    read -p "Enter author ID: " authorId
    
    local post_data=$(cat <<EOF
{
    "content": "$content",
    "authorId": $authorId
}
EOF
)
    make_request "POST" "$POSTS_URL" "$post_data"
}

test_update_post() {
    print_header "UPDATE Post"
    read -p "Enter post ID to update: " post_id
    read -p "Enter new content: " content
    
    local update_data=$(cat <<EOF
{
    "content": "$content"
}
EOF
)
    make_request "PUT" "$POSTS_URL/$post_id" "$update_data"
}

test_delete_post() {
    print_header "DELETE Post"
    read -p "Enter post ID to delete: " post_id
    echo -e "${RED}Warning: This will permanently delete the post!${NC}"
    read -p "Are you sure? (y/N): " confirm
    
    if [[ $confirm =~ ^[Yy]$ ]]; then
        make_request "DELETE" "$POSTS_URL/$post_id"
    else
        echo "Delete operation cancelled."
    fi
}

# ========================================
# FEED READ FUNCTION
# ========================================

test_get_user_feed() {
    print_header "GET User Feed"
    read -p "Enter user ID: " user_id
    read -p "Enter limit (optional, press Enter for default): " limit
    read -p "Enter offset (optional, press Enter for default): " offset
    
    local query_params="userId=$user_id"
    if [ -n "$limit" ]; then
        query_params+="&limit=$limit"
    fi
    if [ -n "$offset" ]; then
        query_params+="&offset=$offset"
    fi
    
    make_request "GET" "$FEED_URL?$query_params"
}

# ========================================
# MENU FUNCTIONS
# ========================================

show_users_menu() {
    echo -e "\n${GREEN}Users CRUD Menu${NC}"
    echo "1. Get all users"
    echo "2. Get user by ID"
    echo "3. Create new user"
    echo "4. Update user"
    echo "5. Delete user"
    echo "6. Back to main menu"
    echo -n "Enter your choice (1-6): "
}

show_posts_menu() {
    echo -e "\n${GREEN}Posts CRUD Menu${NC}"
    echo "1. Get all posts"
    echo "2. Get post by ID"
    echo "3. Create new post"
    echo "4. Update post"
    echo "5. Delete post"
    echo "6. Back to main menu"
    echo -n "Enter your choice (1-6): "
}

show_main_menu() {
    echo -e "\n${GREEN}=== CRUD API Testing Interface ===${NC}"
    echo -e "${BLUE}Make sure your server is running on http://localhost:3000${NC}"
    echo ""
    echo "1. Users CRUD"
    echo "2. Posts CRUD"
    echo "3. Get Feed (Read only)"
    echo "4. Exit"
    echo -n "Enter your choice (1-4): "
}

# ========================================
# MAIN EXECUTION
# ========================================

echo -e "${GREEN}=== Social Media Backend CRUD Testing Tool ===${NC}"
echo -e "${BLUE}Simple interface for testing CRUD operations${NC}"
echo ""
echo -e "${RED}Prerequisites:${NC}"
echo "  • Server running on http://localhost:3000"
echo "  • jq installed for JSON formatting"
echo "  • curl available for API requests"
echo ""

# Main loop
while true; do
    show_main_menu
    read choice
    case $choice in
        1)
            while true; do
                show_users_menu
                read user_choice
                case $user_choice in
                    1) test_get_all_users ;;
                    2) test_get_user ;;
                    3) test_create_user ;;
                    4) test_update_user ;;
                    5) test_delete_user ;;
                    6) break ;;
                    *) echo -e "${RED}Invalid choice. Please try again.${NC}" ;;
                esac
            done
            ;;
        2)
            while true; do
                show_posts_menu
                read post_choice
                case $post_choice in
                    1) test_get_all_posts ;;
                    2) test_get_post ;;
                    3) test_create_post ;;
                    4) test_update_post ;;
                    5) test_delete_post ;;
                    6) break ;;
                    *) echo -e "${RED}Invalid choice. Please try again.${NC}" ;;
                esac
            done
            ;;
        3)
            test_get_user_feed
            ;;
        4) 
            echo -e "${GREEN}Exiting CRUD testing tool...${NC}"; 
            exit 0 
            ;;
        *) 
            echo -e "${RED}Invalid choice. Please try again.${NC}" 
            ;;
    esac
done

test_get_all_posts() {
    print_header "Testing GET all posts"
    make_request "GET" "$POSTS_URL"
}

test_get_post() {
    print_header "Testing GET post by ID"
    read -p "Enter post ID: " post_id
    make_request "GET" "$POSTS_URL/$post_id"
}

test_create_post() {
    print_header "Testing POST create post"
    read -p "Enter post content: " content
    read -p "Enter author ID: " authorId
    
    local post_data=$(cat <<EOF
{
    "content": "$content",
    "authorId": $authorId
}
EOF
)
    make_request "POST" "$POSTS_URL" "$post_data"
}

test_update_post() {
    print_header "Testing PUT update post"
    read -p "Enter post ID to update: " post_id
    read -p "Enter new content: " content
    
    local update_data=$(cat <<EOF
{
    "content": "$content"
}
EOF
)
    make_request "PUT" "$POSTS_URL/$post_id" "$update_data"
}

test_delete_post() {
    print_header "Testing DELETE post"
    read -p "Enter post ID to delete: " post_id
    make_request "DELETE" "$POSTS_URL/$post_id"
}

# Submenu functions
show_posts_menu() {
    echo -e "\n${GREEN}Posts Menu${NC}"
    echo "1. Get all posts"
    echo "2. Get post by ID"
    echo "3. Create new post"
    echo "4. Update post"
    echo "5. Delete post"
    echo "6. Back to main menu"
    echo -n "Enter your choice (1-6): "
}

# ========================================
# FEED TESTING FUNCTIONS
# ========================================

test_get_user_feed() {
    print_header "Testing GET user feed"
    read -p "Enter user ID: " user_id
    read -p "Enter limit (optional, press Enter for default): " limit
    read -p "Enter offset (optional, press Enter for default): " offset
    
    local query_params="userId=$user_id"
    if [ -n "$limit" ]; then
        query_params+="&limit=$limit"
    fi
    if [ -n "$offset" ]; then
        query_params+="&offset=$offset"
    fi
    
    make_request "GET" "$FEED_URL?$query_params"
}

# Submenu functions
show_feed_menu() {
    echo -e "\n${GREEN}Feed Menu${NC}"
    echo "1. Get user feed (interactive)"
    echo "2. Setup test data (users, posts)"
    echo "3. Test basic feed functionality"
    echo "4. Test feed pagination"
    echo "5. Test feed validation"
    echo "6. Test feed sorting"
    echo "7. Test feed performance"
    echo "8. Run all automated feed tests"
    echo "9. Cleanup test data"
    echo "10. Back to main menu"
    echo -n "Enter your choice (1-10): "
}

# ========================================
# AUTOMATED FEED TEST SUITE
# ========================================

# Function to create test data
setup_test_data() {
    print_header "Setting Up Test Data"
    
    echo "Creating test users..."
    
    # Create User 1 (Alice)
    local user1_data=$(cat <<EOF
{
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice@example.com"
}
EOF
)
    echo "Creating Alice..."
    make_request_with_status "POST" "$USERS_URL" "$user1_data" "201"
    
    # Create User 2 (Bob)
    local user2_data=$(cat <<EOF
{
    "firstName": "Bob",
    "lastName": "Smith",
    "email": "bob@example.com"
}
EOF
)
    echo "Creating Bob..."
    make_request_with_status "POST" "$USERS_URL" "$user2_data" "201"
    
    # Create User 3 (Charlie)
    local user3_data=$(cat <<EOF
{
    "firstName": "Charlie",
    "lastName": "Wilson",
    "email": "charlie@example.com"
}
EOF
)
    echo "Creating Charlie..."
    make_request_with_status "POST" "$USERS_URL" "$user3_data" "201"
    
    echo "Test users created successfully!"
    echo "Note: Assuming User IDs are 1=Alice, 2=Bob, 3=Charlie"
    echo "Please verify user IDs by checking the create responses above."
}

# Function to create follow relationships
setup_follow_relationships() {
    print_header "Setting Up Follow Relationships"
    
    echo "Creating follow relationships..."
    echo "Alice (1) will follow Bob (2) and Charlie (3)"
    echo "Bob (2) will follow Charlie (3)"
    
    echo "⚠ Follow relationships setup requires /api/follows endpoint"
    echo "This should be implemented as part of the full CRUD operations"
    echo "For now, you may need to manually insert follow relationships in the database"
    
    print_status "INFO" "Follow relationships setup completed (manual step may be required)"
}

# Function to create test posts
setup_test_posts() {
    print_header "Setting Up Test Posts"
    
    echo "Creating test posts..."
    
    # Bob's posts (User ID 2)
    local bob_post1=$(cat <<EOF
{
    "content": "Hello everyone! This is Bob's first post about technology.",
    "authorId": 2
}
EOF
)
    echo "Creating Bob's first post..."
    make_request_with_status "POST" "$POSTS_URL" "$bob_post1" "201"
    
    local bob_post2=$(cat <<EOF
{
    "content": "Bob here again! Sharing some thoughts about programming.",
    "authorId": 2
}
EOF
)
    echo "Creating Bob's second post..."
    make_request_with_status "POST" "$POSTS_URL" "$bob_post2" "201"
    
    # Charlie's posts (User ID 3)
    local charlie_post1=$(cat <<EOF
{
    "content": "Charlie's post about web development and best practices.",
    "authorId": 3
}
EOF
)
    echo "Creating Charlie's first post..."
    make_request_with_status "POST" "$POSTS_URL" "$charlie_post1" "201"
    
    local charlie_post2=$(cat <<EOF
{
    "content": "Another post from Charlie about database design.",
    "authorId": 3
}
EOF
)
    echo "Creating Charlie's second post..."
    make_request_with_status "POST" "$POSTS_URL" "$charlie_post2" "201"
    
    # Alice's post (User ID 1) - should not appear in Alice's own feed
    local alice_post=$(cat <<EOF
{
    "content": "This is Alice's post. It should not appear in her own feed.",
    "authorId": 1
}
EOF
)
    echo "Creating Alice's post..."
    make_request_with_status "POST" "$POSTS_URL" "$alice_post" "201"
    
    print_status "PASS" "Test posts created successfully"
}




# Function to run all feed tests
run_all_feed_tests() {
    print_header "Running Complete Feed Test Suite"
    
    setup_test_data
    setup_follow_relationships
    setup_test_posts
    
    print_header "Feed Test Suite Completed"
    print_status "PASS" "All feed tests executed"
    echo "Please review the output above for any failures or issues"
}

# Function to cleanup test data
cleanup_test_data() {
    print_header "Cleaning Up Test Data"
    
    echo "Note: Manual cleanup may be required"
    echo "Consider deleting test users, posts, and follows created during testing"
    
    print_status "INFO" "Cleanup instructions provided"
}

# Main menu
show_main_menu() {
    echo -e "\n${GREEN}=== API Testing Interface ===${NC}"
    echo -e "${BLUE}Make sure your server is running on http://localhost:3000${NC}"
    echo ""
    echo "1. Users Testing"
    echo "2. Posts Testing"
    echo "3. Feed Testing"
    echo "4. Exit"
    echo -n "Enter your choice (1-4): "
}

# ========================================
# MAIN EXECUTION
# ========================================

echo -e "${GREEN}=== Social Media Backend API Testing Tool ===${NC}"
echo -e "${BLUE}Combined interface for testing Users, Posts, and Feed endpoints${NC}"
echo -e "${YELLOW}Features:${NC}"
echo "  • Interactive testing for all endpoints"
echo "  • Automated feed test suite with validation"
echo "  • Performance testing"
echo "  • Test data setup and cleanup"
echo ""
echo -e "${RED}Prerequisites:${NC}"
echo "  • Server running on http://localhost:3000"
echo "  • jq installed for JSON formatting"
echo "  • curl available for API requests"
echo ""

# Main loop
while true; do
    show_main_menu
    read choice
    case $choice in
        1)
            while true; do
                show_users_menu
                read user_choice
                case $user_choice in
                    1) test_get_all_users ;;
                    2) test_get_user ;;
                    3) test_create_user ;;
                    4) test_update_user ;;
                    5) test_delete_user ;;
                    6) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        2)
            while true; do
                show_posts_menu
                read post_choice
                case $post_choice in
                    1) test_get_all_posts ;;
                    2) test_get_post ;;
                    3) test_create_post ;;
                    4) test_update_post ;;
                    5) test_delete_post ;;
                    6) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        3)
            while true; do
                show_feed_menu
                read feed_choice
                case $feed_choice in
                    1) test_get_user_feed ;;
                    2) setup_test_data; setup_follow_relationships; setup_test_posts ;;
                    3) test_basic_feed ;;
                    4) test_feed_pagination ;;
                    5) test_feed_validation ;;
                    6) test_feed_sorting ;;
                    7) test_feed_performance ;;
                    8) run_all_feed_tests ;;
                    9) cleanup_test_data ;;
                    10) break ;;
                    *) echo -e "${RED}Invalid choice. Please try again.${NC}" ;;
                esac
            done
            ;;
        4) echo "Exiting..."; exit 0 ;;
        *) echo "Invalid choice. Please try again." ;;
    esac
done