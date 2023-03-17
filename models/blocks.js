const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;


//Schema: Viewer
var ViewerSchema = new Schema({
    user: { type: ObjectId, ref: 'users' },
    count: { type: Number, default: 1 },
    updated_at: Date
});
//Schema: Attachment
var AttachmentSchema = new Schema({
    type: { type: String, enum: ['audio', 'video', 'file'] },
    file: {
        size: Number,
        icon: String,
        ext: String
    },
    provider: {
        name: String,
        url: String,
        favicon: String
    }
});
//Schema: Response
var ResponseSchema = new Schema({
    /* Text */
    text: String,
    summary: String,
    image: {
        m: String,
        l: String
    },
    bound: Number,
    images: [String],
    /* Audio, Video, File */
    attachments: [AttachmentSchema],
    /* Match the following */
    matched_to: { type: ObjectId, ref: 'Option' },
    /* Order for Grid cell */
    order: { type: Number, index: true },
    /* User */
    creator: { type: ObjectId, ref: 'users' },
    created_at: { type: Date, default: Date.now },
    updated_at: Date
});
//Schema: MCQ and Match the following options
var OptionSchema = new Schema({
    text: String,
    image: {
        m: String,
        l: String
    },
    bound: String,
    is_correct: { type: Boolean, default: false },
    /* Match the following */
    correct_options: [{ type: ObjectId, ref: 'Option' }],
    matchers: [ResponseSchema],
    color: String,
    is_optionb: { type: Boolean, default: false },
    /* MCQ */
    voters: [{ type: ObjectId, ref: 'users' }]
});
//Schema: Fill in the blanks
var FillSchema = new Schema({
    text: String,
    /* If blank */
    is_blank: { type: Boolean, default: 'false' },
    size: Number,
    keywords: [String],
    /* Responses */
    responses: [ResponseSchema]
});
//Schema: Item - Table, List or Grid items
var ItemSchema = new Schema({
    type: { type: String, required: true, enum: ['text', 'image', 'audio', 'video', 'file', 'link', 'header', 'checkbox', 'locked', 'button', 'response'], default: 'text' },
    /* Table cell */
    row: Number,
    col: Number,
    /* Text */
    title: String,
    summary: String,
    text: String,
    /* Image */
    image: {
        m: String,
        l: String
    },
    bound: Number,
    images: [String],
    /* File, Audio, Video */
    file: {
        size: Number,
        icon: String,
        ext: String
    },
    /* Link | File | Embed */
    provider: {
        name: String,
        url: String,
        favicon: String
    },
    embed: String, //video code or embed code
    embed_type: String,
    publish_date: Date,
    /* Button */
    button: {
        url: String,
        block: Number,
        is_new_tab: { type: Boolean, default: true }
    },
    /* Response */
    is_right: { type: Boolean, default: false },
    responses: [ResponseSchema],
    /* User */
    creator: { type: ObjectId, ref: 'users' },
    created_at: { type: Date, default: Date.now },
    updated_at: Date
});
//Schema: Comment
var CommentSchema = new Schema({
    /* Text */
    text: String,
    summary: String,
    image: {
        m: String,
        l: String
    },
    bound: Number,
    images: [String],
    /* Audio, Video, File */
    attachment: [AttachmentSchema],
    /* Actions */
    likes: [{ type: ObjectId, ref: 'users' }],
    is_recent: { type: Boolean },
    reply_to: ObjectId,
    cohortId: { type: ObjectId, ref: 'Cohort' },
    /* User */
    creator: { type: ObjectId, ref: 'users' },
    created_at: { type: Date, default: Date.now },
    updated_at: Date
});
//Schema: Feedback badges
var FeedbackBadgeSchema = new Schema({
    badge: { type: ObjectId, ref: 'Badge' },
    skill_inc: { type: Number }
});
//Schema: Feedback
var FeedbackSchema = new Schema({
    text: String,
    badges: [FeedbackBadgeSchema],
    /* MCQs */
    selected_options: [{ type: ObjectId, ref: 'Option' }],
    /* Fill in the blanks */
    fill_id: { type: ObjectId, ref: 'Fill' },
    fill_items: [String],
    /* Shown to users */
    users: [{ type: ObjectId, ref: 'users' }]
});
//Schema: Block
var BlockSchema = new mongoose.Schema({
    order: { type: Number, index: true, default: 1 },
    slug: { type: String, index: true, unique: true, sparse: true },
    type: { type: String, required: true, enum: ['text', 'button', 'divider', 'toggle_list', 'image', 'link', 'video', 'audio', 'file', 'gif', 'mcq', 'fill', 'match', 'response', 'list', 'container', 'grid', 'comic', 'embed', 'discussion'] },
    /* Course */
    course: { type: ObjectId, ref: 'courses' },
    is_active: { type: Boolean, default: true },
    is_required: { type: Boolean, default: false },
    is_hidden: { type: Boolean, default: false }, //Is hidden from learners
    /* Text */
    title: String,
    summary: String,
    text: String,
    images: [String],
    /* Button */
    button: {
        url: String,
        block: Number, //Jump to block
        is_new_tab: { type: Boolean, default: true }
    },
    /* Divider */
    divider: {
        type: { type: String, enum: ['empty', 'animation', 'music', 'game'], default: 'empty' },
        time: Number, //Time in seconds
        name: String //Name of animation, music or game
    },
    /* Image, Comic */
    image: {
        m: String,
        l: String
    },
    bound: Number,
    /* File, Audio, Video */
    file: {
        size: Number,
        icon: String,
        ext: String
    },
    /* Link | File | Embed */
    provider: {
        name: String,
        url: String,
        favicon: String
    },
    embed: {
        code: String,
        kind: String,
        width: Number,
        height: Number
    },
    publish_date: Date,
    /* GIF */
    gif: {
        embed: String,
        url: String,
        width: String,
        height: String
    },
    /* MCQs | Image MCQs */
    mcqs: [OptionSchema],
    is_multiple: { type: Boolean, default: false },
    /* Fill in the blanks */
    fills: [FillSchema],
    /* Match the following */
    options: [OptionSchema],
    /* Response */
    response_type: { type: String, enum: ['text', 'audio', 'video', 'canvas', 'file'] },
    responses: [ResponseSchema],
    keywords: [String],
    /* Toggle_List, List, Container or Grid cells */
    items: [ItemSchema],
    /* Container */
    container: ObjectId,
    /* Theme */
    theme: String,
    art: {
        m: String,
        l: String,
        bound: Number
    },
    size: {
        width: { type: Number, default: 100 },
        margin: { type: Number, default: 0 }
    },
    /* Feedback */
    feedbacks: [FeedbackSchema],
    /* Extra */
    alt_text: String,
    ref_url: String,
    extra: String,
    /* Comments */
    has_discussion: { type: Boolean, default: false },
    is_restricted: { type: Boolean, default: false },
    is_collapsed: { type: Boolean, default: false },
    comments: [CommentSchema],
    /* Viewers */
    viewers: [ViewerSchema],
    /* User */
    creator: { type: ObjectId, ref: 'users' },
    created_at: { type: Date, default: Date.now },
    updated_at: Date,
    assessmentType: { type: ObjectId, ref: 'AssessmentType' },
    typeOfBlock: { type: String, enum: ['attempt', 'score', 'none'], default: 'none' },
    score: { type: Number, min: 1, max: 10, default: 5 },
    highlightIfIncorrect: { type: Boolean, default: false },
    isCorrectnessSatisfied: { type: Boolean, default: true }
});

// Optional
BlockSchema.add({ children: [BlockSchema] });

module.exports = mongoose.model('blocks', BlockSchema);