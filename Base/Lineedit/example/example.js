UIKit.LineEdit.setValue('#addr-field', '192.168.0.5');
const val = UIKit.LineEdit.getValue('#addr-field');

UIKit.LineEdit.setError('#addr-field', 'Неверный формат');
UIKit.LineEdit.clearError('#addr-field');

UIKit.LineEdit.setDisabled('#addr-field', true);
UIKit.LineEdit.focus('#addr-field');
