var _args = arguments[0] || {},
_data = _args.data;

$.taskRow.taskId = _data.id;
$.category.text = _data.type;
$.description.text = _data.notes;
$.taskRow.realIndex = _args.realIndex;
$.taskRow.status = _data.status;
//$.timer.setTime(_data.duration);

$.timer.setAid(_data.aid || null);